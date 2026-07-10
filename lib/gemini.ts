// Server-only Gemini AI helper for blog article generation

export interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}

// Extract a JSON string value starting at the given position after the opening quote
// Handles unescaped internal quotes by checking if the quote is followed by a structural character
function extractStringValue(text: string, startIdx: number): { value: string; endIdx: number } {
  let result = '';
  let i = startIdx;

  while (i < text.length) {
    const ch = text[i];

    // Handle escaped characters
    if (ch === '\\' && i + 1 < text.length) {
      result += ch + text[i + 1];
      i += 2;
      continue;
    }

    // Found a closing quote - check if it's really the end
    if (ch === '"') {
      const rest = text.slice(i + 1).trimStart();
      // If followed by , or } or ], it's the closing quote
      if (rest.startsWith(',') || rest.startsWith('}') || rest.startsWith(']')) {
        return { value: result, endIdx: i };
      }
      // Otherwise it's an unescaped internal quote - escape it
      result += '\\"';
      i++;
      continue;
    }

    result += ch;
    i++;
  }

  // If we got here, the string is unterminated - return what we have
  return { value: result, endIdx: i };
}

// Extract a JSON array of strings starting at the given position after the opening bracket
function extractStringArray(text: string, startIdx: number): { value: string[]; endIdx: number } {
  const result: string[] = [];
  let i = startIdx;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '"') {
      const { value, endIdx } = extractStringValue(text, i + 1);
      result.push(value);
      i = endIdx + 1;
      // Skip whitespace and comma
      while (i < text.length && (text[i] === ',' || text[i] === ' ' || text[i] === '\n' || text[i] === '\r' || text[i] === '\t')) {
        i++;
      }
      continue;
    }

    if (ch === ']') {
      return { value: result, endIdx: i };
    }

    i++;
  }

  return { value: result, endIdx: i };
}

// Manual field-by-field extraction when JSON.parse fails
function extractFieldsManually(text: string): any {
  const fields: Record<string, string | string[]> = {};
  const fieldOrder = ['title', 'slug', 'excerpt', 'content', 'category', 'tags'];

  let pos = 0;

  for (const field of fieldOrder) {
    // Find the field key in the remaining text
    const keyPattern = `"${field}"\\s*:\\s*`;
    const keyMatch = text.slice(pos).match(new RegExp(keyPattern));
    if (!keyMatch) continue;

    pos += (keyMatch.index || 0) + keyMatch[0].length;

    if (field === 'tags') {
      // Expecting an array
      if (text[pos] === '[') {
        const { value, endIdx } = extractStringArray(text, pos + 1);
        fields[field] = value;
        pos = endIdx + 1;
      }
    } else {
      // Expecting a string value
      if (text[pos] === '"') {
        const { value, endIdx } = extractStringValue(text, pos + 1);
        fields[field] = value;
        pos = endIdx + 1;
      }
    }
  }

  return fields;
}

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

  // Deep cleanup: fix unescaped newlines within strings
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
    // Continue
  }

  // Clean trailing commas
  cleaned = cleaned
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/`/g, '')
    .trim();

  // Fourth try: after cleaning
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to manual extraction
  }

  // Final fallback: extract fields manually (handles unescaped quotes in string values)
  const extracted = extractFieldsManually(cleaned);
  if (extracted.title && extracted.content) {
    return extracted;
  }

  // If we got here, nothing worked
  // Try to show a snippet of the JSON for debugging
  const snippet = cleaned.slice(0, 300);
  throw new Error(`Gemini devolvió JSON inválido: no se pudo extraer el contenido. Inicio: ${snippet}`);
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

IMPORTANTE: El JSON debe ser ESTRICTAMENTE VÁLIDO. Escapa todas las comillas dobles dentro de los strings como \\". Escapa los saltos de línea como \\n. No pongas comillas dobles sin escapar dentro de ningún valor. Si necesitas citar algo en el contenido, usa comillas simples 'así' en lugar de dobles.

RESPONDE ÚNICAMENTE CON JSON CRUDO. SIN markdown, SIN bloques de código, SIN comillas invertidas, SIN etiquetas. Solo el JSON plano.

Ejemplo exacto:
{"title": "Título SEO", "slug": "slug-unico", "excerpt": "Resumen breve", "content": "## Título\\n\\nContenido del artículo con comillas simples 'así'", "category": "Recetas", "tags": ["tag1", "tag2"]}`;

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const fetchOptions = {
    method: 'POST' as const,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
        response_mime_type: 'application/json',
      },
    }),
  };

  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [5000, 10000, 15000];
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, fetchOptions);

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

      const parsed = parseGeminiJSON(text);
      const article = parsed as GeneratedArticle;

      if (!article.title || !article.slug || !article.content) {
        throw new Error('Gemini devolvió un JSON incompleto');
      }

      article.slug = article.slug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

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
      if (attempt >= MAX_RETRIES) {
        throw new Error(`Error generando artículo: ${lastError!.message}`);
      }
    }
  }

  throw lastError || new Error('Error generando artículo: Error desconocido');
}
