// Server-only Gemini AI helper for blog article generation

// Helper to try to fix common JSON issues from LLM output
function parseGeminiJSON(raw: string): any {
  // First try: standard parse
  try {
    return JSON.parse(raw);
  } catch {
    // Continue to cleanup
  }

  // Try to extract between first { and last }
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('No se encontró JSON en la respuesta de Gemini');
  }
  let json = raw.slice(firstBrace, lastBrace + 1);

  // Remove markdown code blocks if any remain
  json = json.replace(/```(?:json)?\s*/gi, '').replace(/\s*```/g, '');

  // Second try: after extracting content
  try {
    return JSON.parse(json);
  } catch {
    // Continue to deep cleanup
  }

  // Deep cleanup: fix unescaped characters inside JSON string values
  // Strategy: rebuild the JSON by finding key-value pairs
  // First, try to fix unescaped newlines within strings
  let cleaned = '';
  let inString = false;
  let escape = false;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i];
    if (escape) {
      cleaned += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      cleaned += ch;
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      cleaned += ch;
      continue;
    }
    if (inString && (ch === '\n' || ch === '\r')) {
      // Replace literal newlines in strings with \n
      cleaned += '\\n';
      continue;
    }
    cleaned += ch;
  }

  // Third try: after fixing newlines
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to last resort
  }

  // Last resort: remove trailing commas and any remaining backticks
  let final = cleaned
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/`/g, '')
    .trim();

  return JSON.parse(final);
}

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

IMPORTANTE: El contenido del artículo usa ## para títulos, ### para subtítulos y - para listas. El JSON debe ser VÁLIDO: escapa las comillas dobles como \" y los saltos de línea como \n dentro de los strings. No uses saltos de línea literales en los valores del JSON.

RESPONDE ÚNICAMENTE CON JSON CRUDO. SIN markdown, SIN bloques de código, SIN comillas invertidas, SIN etiquetas. Solo el JSON plano en una sola línea o con saltos de línea JSON válidos.

Ejemplo de JSON exacto a devolver:
{
  "title": "Título SEO máximo 60 caracteres",
  "slug": "slug-unico-en-minusculas-con-guiones",
  "excerpt": "Resumen breve máximo 160 caracteres",
  "content": "Contenido del artículo con ## y ### y -",
  "category": "Categoría de las listadas",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}`;

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const fetchOptions = {
    method: 'POST' as const,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
      },
    }),
  };

  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [5000, 10000, 15000]; // 5s, 10s, 15s
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, fetchOptions);

      // If model is busy (503), wait and retry
      if (res.status === 503 && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAYS[attempt];
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errBody.slice(0, 200)}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Gemini no devolvió contenido');
      }

      // Parse the JSON from the response (with robust cleanup for LLM output)
      const parsed = parseGeminiJSON(text);
      const article = parsed as GeneratedArticle;

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
      lastError = error;
      // If we've exhausted retries, stop retrying
      if (attempt >= MAX_RETRIES) {
        throw new Error(`Error generando artículo: ${lastError!.message}`);
      }
    }
  }

  // Should never reach here, but TypeScript safety
  throw lastError || new Error('Error generando artículo: Error desconocido');
}
