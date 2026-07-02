import fs from 'fs/promises';
import path from 'path';
import type { AppData } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_SETTINGS = {
  businessName: 'Mi Negocio',
  currency: 'EUR',
  currencySymbol: '€',
  defaultMargin: 30,
  taxRate: 21,
  lowStockThreshold: 5,
};

const DEFAULT_DATA: AppData = {
  products: [],
  sales: [],
  expenses: [],
  orders: [],
  settings: DEFAULT_SETTINGS,
};

export async function getData(): Promise<AppData> {
  try {
    await fs.access(DATA_FILE);
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw) as AppData;
    // Merge with defaults
    return {
      ...DEFAULT_DATA,
      ...data,
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
    };
  } catch {
    // File doesn't exist yet — return defaults
    return DEFAULT_DATA;
  }
}

export async function setData(data: AppData): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('No se pudo guardar los datos en el servidor.');
  }
}
