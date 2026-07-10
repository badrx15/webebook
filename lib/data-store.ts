import type { AppData } from './types';
import { put, list, get } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Blob pathname on Vercel Blob Storage
const BLOB_PATHNAME = 'ibericos-gourmet-db.json';

const DEFAULT_SETTINGS = {
  businessName: 'Mi Negocio',
  currency: 'EUR',
  currencySymbol: '€',
  defaultMargin: 30,
  taxRate: 21,
  lowStockThreshold: 5,
};

const SEED_BLOG_POSTS = [
  {
    id: 'seed-1',
    slug: 'como-conservar-jamon-iberico-envasado-al-vacio',
    title: 'Cómo conservar el jamón ibérico envasado al vacío',
    excerpt: 'Descubre los mejores consejos para conservar tu jamón ibérico envasado al vacío y mantener todo su sabor y aroma durante meses.',
    content: `## ¿Cuánto dura el jamón ibérico envasado al vacío?

El jamón ibérico envasado al vacío es una de las mejores formas de conservar este manjar. Si se mantiene en condiciones adecuadas, puede conservarse en perfecto estado hasta 6 meses desde su fecha de envasado.

## Condiciones ideales de conservación

Para mantener todas las propiedades del jamón ibérico, es importante seguir estas recomendaciones:

- **Temperatura**: entre 5°C y 10°C. El frigorífico es el lugar ideal.
- **Humedad**: evitar cambios bruscos de temperatura que puedan generar condensación.
- **Luz**: mantener alejado de la luz directa del sol.
- **Posición**: guardar el envase en posición horizontal para que el aceite se distribuya uniformemente.

## ¿Se puede congelar el jamón ibérico?

Sí, el jamón ibérico se puede congelar sin problema. Eso sí, recomendamos consumirlo en un plazo máximo de 3 meses para disfrutar de todo su sabor.

## Cómo descongelar correctamente

Para descongelar el jamón ibérico:
1. Sácalo del congelador y colócalo en el frigorífico 24 horas antes de consumirlo.
2. No lo descongeles nunca a temperatura ambiente ni en el microondas.
3. Una vez descongelado, consúmelo en un plazo de 2-3 días.

## Una vez abierto el envase

Una vez abierto el envase al vacío, el jamón ibérico debe consumirse en un plazo de 3-5 días. Para conservarlo después de abierto:

- Envuelve las lonchas en papel de horno o film transparente.
- Guárdalo en la parte menos fría del frigorífico.
- Saca las lonchas unos 15 minutos antes de consumirlas para que recuperen su temperatura y aroma óptimos.`,
    category: 'Consejos',
    tags: ['conservación', 'jamón ibérico', 'envasado al vacío', 'consejos'],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    slug: 'recetas-faciles-con-jamon-iberico',
    title: '5 recetas fáciles con jamón ibérico para sorprender',
    excerpt: 'Prepara estos 5 platos sencillos pero espectaculares con jamón ibérico. Desde tapas clásicas hasta platos más elaborados.',
    content: `## 1. Tosta de jamón ibérico con tomate y aceite

La combinación más clásica y deliciosa:

- Tuesta una rebanada de pan de pueblo.
- Frota un tomate maduro partido por la mitad sobre el pan.
- Añade un chorrito de aceite de oliva virgen extra.
- Coloca 3-4 lonchas de jamón ibérico por encima.
- Un toque de sal en escamas y ¡a disfrutar!

## 2. Huevos rotos con jamón ibérico

Un clásico de la cocina española:

- Fríe patatas en dados hasta que estén doradas.
- En una sartén aparte, fríe 2 huevos dejando la yema líquida.
- Coloca las patatas en un plato, los huevos encima y rompe las yemas.
- Añade lonchas de jamón ibérico por encima.
- El calor de las patatas y los huevos calentará ligeramente el jamón.

## 3. Espárragos trigueros envueltos en jamón

Un entrante ligero y elegante:

- Lava y corta la parte dura de los espárragos trigueros.
- Saltéalos en una sartén con aceite de oliva durante 3-4 minutos.
- Envuelve cada espárrago con media loncha de jamón ibérico.
- Gratínalos 2 minutos al horno a 200°C.
- Sirve calientes con un toque de limón.

## 4. Melón con jamón ibérico

El contraste dulce-salado perfecto:

- Corta un melón bien maduro en dados o en bolitas con un sacabolas.
- Coloca las lonchas de jamón ibérico sobre el melón.
- Añade unas hojas de menta fresca.
- Un toque de pimienta negra recién molida.
- Sirve frío como entrante.

## 5. Revuelto de setas con jamón ibérico

Un plato de cuchara reconfortante:

- Limpia y corta 200g de setas variadas.
- Pocha media cebolla en una sartén con aceite de oliva.
- Añade las setas y saltéalas hasta que suelten el agua.
- Bate 3 huevos y cuájalos a fuego bajo con las setas.
- Fuera del fuego, añade el jamón ibérico troceado.
- Sirve con pan tostado.`,
    category: 'Recetas',
    tags: ['recetas', 'jamón ibérico', 'cocina', 'tapas'],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_DATA: AppData = {
  products: [],
  sales: [],
  expenses: [],
  orders: [],
  blogPosts: SEED_BLOG_POSTS,
  settings: DEFAULT_SETTINGS,
};

function mergeWithDefaults(raw: any): AppData {
  return {
    ...DEFAULT_DATA,
    ...raw,
    settings: { ...DEFAULT_SETTINGS, ...raw.settings },
  };
}

const isVercelBlobAvailable = typeof process.env.BLOB_READ_WRITE_TOKEN === 'string' && process.env.BLOB_READ_WRITE_TOKEN.length > 0;

export async function getData(): Promise<AppData> {
  if (isVercelBlobAvailable) {
    return getFromBlob();
  }
  return getFromFile();
}

export async function setData(data: AppData): Promise<void> {
  if (isVercelBlobAvailable) {
    await saveToBlob(data);
    return;
  }
  await saveToFile(data);
}

// --- Vercel Blob (production) ---

const BLOB_OPTIONS = {
  access: 'private' as const,
  contentType: 'application/json' as const,
  addRandomSuffix: false,
  allowOverwrite: true,
};

async function getFromBlob(): Promise<AppData> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
    if (blobs.length === 0) return DEFAULT_DATA;

    const result = await get(blobs[0].url, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return DEFAULT_DATA;
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return mergeWithDefaults(data);
  } catch (error) {
    console.error('Error reading from Vercel Blob:', error);
    return DEFAULT_DATA;
  }
}

async function saveToBlob(data: AppData): Promise<void> {
  try {
    const jsonString = JSON.stringify(data);
    await put(BLOB_PATHNAME, jsonString, BLOB_OPTIONS);
  } catch (error) {
    console.error('Error writing to Vercel Blob:', error);
    throw new Error('No se pudieron guardar los datos en el almacenamiento.');
  }
}

// --- Local file system (development) ---

async function getFromFile(): Promise<AppData> {
  try {
    await fs.access(DATA_FILE);
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return mergeWithDefaults(data);
  } catch {
    return DEFAULT_DATA;
  }
}

async function saveToFile(data: AppData): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('No se pudo guardar los datos en el servidor.');
  }
}
