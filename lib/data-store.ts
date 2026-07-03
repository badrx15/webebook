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
  originAddress: {
    fullName: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'ES',
  },
};

const DEFAULT_DATA: AppData = {
  products: [],
  sales: [],
  expenses: [],
  orders: [],
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
