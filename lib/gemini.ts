// Server-only Gemini AI helper for blog article generation

export interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}

export async function generateArticle(keyword: string, existingSlugs: string[]): Promise<GeneratedArticle> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada en las variables de entorno');
  }

  const categories = ['Recetas', 'Consejos', 'Guía de compra', 'Producto'];

  const prompt = `Eres un experto en jamón ibérico y SEO. Genera un artículo de blog en español para la web "Ibéricos Gourmet", una tienda online de jamón ibérico de cebo de campo 75% raza ibérica.

La palabra clave principal es: "${keyword}"

REQUISITOS:
- El artículo debe ser ÚTIL, ORIGINAL y estar optimizado para SEO
- Entre 300-500 palabras
- Usa formato con ## para títulos, ### para subtítulos, - para listas
- Incluye la palabra clave "${keyword}" de forma natural en el texto
- El slug no debe ser ninguno de estos: ${existingSlugs.join(', ') || 'ninguno'}
- NO uses placeholders como [nombre del producto]
- Si mencionas productos, di "nuestro jamón" o "Ibéricos Gourmet"
- Al final, incluye una llamada a la acción suave para comprar

RESPONDE ÚNICAMENTE CON JSON CRUDO. SIN markdown, SIN bloques de código, SIN comillas invertidas, SIN etiquetas de ningún tipo. Solo el JSON plano, nada más ni nada menos.

Ejemplo de JSON exacto a devolver:
{
  "title": "Título SEO máximo 60 caracteres",
  "slug": "slug-unico-en-minusculas-con-guiones",
  "excerpt": "Resumen breve máximo 160 caracteres",
  "content": "Contenido del artículo con ## y ### y -",
  "category": "Categoría de las listadas",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini no devolvió contenido');
    }

    // Parse the JSON from the response
    let jsonStr = text.trim();

    // Strategy 1: Try extracting from markdown code block
    let jsonMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // Strategy 2: Try to find first { and last } in the text
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
      }
    }

    // Try to parse
    let article: GeneratedArticle;
    try {
      article = JSON.parse(jsonStr) as GeneratedArticle;
    } catch {
      // Strategy 3: Clean up common issues and try again
      jsonStr = jsonStr
        .replace(/```/g, '')
        .replace(/^json\s*/i, '')
        .trim();
      article = JSON.parse(jsonStr) as GeneratedArticle;
    }

    // Validate
    if (!article.title || !article.slug || !article.content) {
      throw new Error('Gemini devolvió un JSON incompleto');
    }

    // Clean slug
    article.slug = article.slug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

    // Ensure unique slug
    let finalSlug = article.slug;
    let counter = 1;
    while (existingSlugs.includes(finalSlug)) {
      finalSlug = `${article.slug}-${counter}`;
      counter++;
    }
    article.slug = finalSlug;

    return article;
  } catch (error: any) {
    throw new Error(`Error generando artículo: ${error.message}`);
  }
}
