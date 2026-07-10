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
  // --- Artículo 3: Cómo elegir jamón ibérico (etiquetas) ---
  {
    id: 'seed-3',
    slug: 'como-elegir-jamon-iberico-etiquetas-negra-roja-verde-blanca',
    title: 'Cómo elegir un buen jamón ibérico: guía completa de etiquetas (negra, roja, verde, blanca)',
    excerpt: 'Aprende a distinguir las 4 etiquetas del jamón ibérico. Te explicamos qué significa cada color y cómo elegir la mejor calidad al comprar jamón ibérico online.',
    content: `## ¿Por qué es importante saber distinguir las etiquetas del jamón ibérico?

Si estás pensando en comprar jamón ibérico online, una de las primeras cosas que debes conocer son las etiquetas de colores que regulan su calidad. Este sistema, creado por la ASICI (Asociación Interprofesional del Cerdo Ibérico), te ayuda a saber exactamente qué estás comprando.

## Etiqueta Negra: 100% Ibérico de Bellota

La etiqueta negra es la máxima excelencia. Significa que el jamón proviene de un cerdo 100% ibérico puro (sus padres también son 100% ibérico) y ha sido alimentado exclusivamente con bellotas en la dehesa durante la montanera.

- **Raza**: 100% Ibérica
- **Alimentación**: Bellotas y hierbas naturales
- **Precio**: El más elevado (calidad superior)
- **Sabor**: Intenso, complejo, con notas de bellota

## Etiqueta Roja: Ibérico de Bellota

La etiqueta roja también es de máxima calidad, pero el cerdo tiene un 75% o 50% de raza ibérica. La alimentación es la misma: bellotas en libertad durante la montanera.

- **Raza**: 75% o 50% Ibérica
- **Alimentación**: Bellotas y hierbas naturales
- **Relación calidad-precio**: Excelente. Calidad de bellota a un precio más asequible.

## Etiqueta Verde: Ibérico de Cebo de Campo

El cerdo es ibérico (50-75%) y se cría en libertad en la dehesa, pero su alimentación es a base de pastos naturales y piensos. No come bellotas.

- **Raza**: 50-75% Ibérica
- **Alimentación**: Pastos y piensos naturales
- **Precio**: Más económico que el de bellota
- **Sabor**: Suave y sabroso. Una opción ideal para el día a día.

Nuestro jamón es precisamente de esta categoría: **Cebo de Campo 75% Raza Ibérica**, criado en las dehesas extremeñas con la mejor alimentación natural.

## Etiqueta Blanca: Ibérico de Cebo

El cerdo es ibérico pero se cría en granja y se alimenta exclusivamente de piensos. Es la categoría más básica.

## ¿Cuál comprar según tu presupuesto?

- **Para ocasiones especiales**: Etiqueta Negra o Roja (bellota)
- **Para consumo diario con calidad**: Etiqueta Verde (cebo de campo) — la mejor relación calidad-precio
- **Para cocinar**: Etiqueta Blanca

Si quieres comprar jamón ibérico de cebo de campo con la mejor relación calidad-precio, nuestra selección de 75% raza ibérica es perfecta para ti.`,
    category: 'Guía de compra',
    tags: ['cómo elegir jamón ibérico', 'etiquetas jamón ibérico', 'jamón de bellota', 'cebo de campo', 'comprar jamón ibérico'],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 4: Dónde comprar jamón ibérico online ---
  {
    id: 'seed-4',
    slug: 'donde-comprar-jamon-iberico-online-envio-domicilio',
    title: 'Dónde comprar jamón ibérico online con envío a domicilio de calidad',
    excerpt: 'Guía para comprar jamón ibérico online de forma segura. Consejos para elegir tienda online, tipos de jamón y cómo recibirlo cómodamente en casa.',
    content: `## Comprar jamón ibérico online: una tendencia en crecimiento

Cada vez más personas optan por comprar jamón ibérico online. La comodidad de recibirlo en casa, la posibilidad de comparar precios y la amplia variedad de productos hacen que esta opción sea la favorita de muchos amantes de la gastronomía.

## ¿Qué tener en cuenta al comprar jamón ibérico por internet?

### 1. Etiquetado y calidad

Busca siempre tiendas que especifiquen claramente el tipo de jamón: raza ibérica, alimentación (bellota o cebo de campo) y tiempo de curación. Desconfía de ofertas demasiado baratas sin esta información.

### 2. Formato: entero o loncheado

- **Jamón entero**: Ideal si tienes jamonero y consumes con frecuencia
- **Loncheado y envasado al vacío**: Perfecto para consumo diario, cómodo y práctico. Nuestro jamón se corta a cuchillo y se envasa al vacío para mantener todo el sabor.

### 3. Envío a domicilio

Asegúrate de que la tienda ofrece:
- **Envío seguro** con embalaje al vacío
- **Transporte urgente** para mantener la cadena de frío
- **Seguro en caso de incidencias**

### 4. Opiniones y valoraciones

Revisa las opiniones de otros clientes antes de comprar. Una tienda de confianza tendrá reseñas positivas y transparentes.

## ¿Jamón de bellota o de cebo de campo para comprar online?

- **Jamón de bellota**: Para paladares exigentes, sabor más intenso y complejo. Precio más elevado.
- **Jamón de cebo de campo**: Excelente relación calidad-precio. Nuestro jamón de cebo de campo 75% raza ibérica es la opción ideal si buscas calidad a un precio razonable.

## Ventajas de comprar en Ibéricos Gourmet

- **Cortado a cuchillo** por maestro jamonero, no a máquina
- **Envasado al vacío** individualmente para máxima frescura
- **Envío a domicilio** rápido y seguro
- **Pago seguro** con tarjeta o contra reembolso
- **Atención personalizada** por WhatsApp`,
    category: 'Guía de compra',
    tags: ['comprar jamón ibérico online', 'jamón envío a domicilio', 'tienda jamón online', 'comprar jamón internet'],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 5: Cuánto cuesta el jamón ibérico ---
  {
    id: 'seed-5',
    slug: 'cuanto-cuesta-jamon-iberico-precio-tipos-calidad',
    title: '¿Cuánto cuesta el jamón ibérico? Precios según tipo y calidad',
    excerpt: 'Te explicamos los precios del jamón ibérico según su calidad: bellota, cebo de campo y cebo. Descubre cuál es la mejor opción para tu bolsillo sin sacrificar calidad.',
    content: `## Precio del jamón ibérico: ¿cuánto deberías pagar?

El precio del jamón ibérico varía enormemente según la raza del cerdo, su alimentación y el tiempo de curación. Puedes encontrar desde 15€/kg hasta más de 200€/kg para las piezas más exclusivas.

## Precio según el tipo de jamón

### Jamón de Bellota 100% Ibérico (Etiqueta Negra)

Es el más caro y también el más exclusivo. Los precios oscilan entre:
- **80€ - 200€/kg**
- Una pieza entera (6-7kg): 500€ - 1.400€

### Jamón de Bellota 50-75% Ibérico (Etiqueta Roja)

- **50€ - 90€/kg**
- Una pieza entera: 300€ - 600€

### Jamón de Cebo de Campo 50-75% Ibérico (Etiqueta Verde) — Nuestra recomendación

Es la opción con la mejor relación calidad-precio:
- **25€ - 45€/kg**
- En formato loncheado envasado al vacío, los precios son aún más ajustados
- Perfecto para consumo habitual sin renunciar a la calidad

### Jamón de Cebo (Etiqueta Blanca)

- **12€ - 20€/kg**
- La opción más económica, pero también la de menor calidad

## ¿Merece la pena pagar más por el jamón de bellota?

Depende del uso que le vayas a dar:

- **Para una ocasión especial**: Sí, el jamón de bellota tiene un sabor y textura superiores
- **Para consumo diario**: El jamón de cebo de campo ofrece una calidad excelente a un precio mucho más asequible
- **Para cocinar o taper**: Con uno de cebo básico es suficiente

Nuestro jamón de cebo de campo 75% ibérico está en la mejor franja calidad-precio. Cortado a cuchillo y envasado al vacío, ofrece una experiencia gastronómica excelente por menos de 30€.

## ¿Por qué nuestro precio es competitivo?

Vendemos directamente desde Extremadura, sin intermediarios. Esto nos permite ofrecer jamón ibérico de alta calidad a precios más ajustados que las grandes superficies.

**Conclusión**: Si buscas el mejor jamón ibérico calidad-precio, elige un cebo de campo 75% raza ibérica. Si buscas una experiencia suprema para un regalo o celebración, entonces invierte en un buen bellota.`,
    category: 'Guía de compra',
    tags: ['precio jamón ibérico', 'jamón ibérico barato', 'cuánto cuesta el jamón', 'jamón calidad precio', 'comprar jamón barato'],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 6: Jamón ibérico para regalo ---
  {
    id: 'seed-6',
    slug: 'jamon-iberico-para-regalo-ideas-consejos',
    title: 'Jamón ibérico para regalo: ideas y consejos para acertar siempre',
    excerpt: 'Regalar jamón ibérico es un acierto seguro. Descubre qué tipo elegir según la ocasión y el presupuesto, y cómo presentarlo para sorprender.',
    content: `## ¿Por qué regalar jamón ibérico es siempre un acierto?

El jamón ibérico es uno de los regalos más apreciados en la cultura española. Ya sea para Navidad, un cumpleaños, un detalle empresarial o una cena especial, un buen jamón siempre es bien recibido.

## ¿Qué tipo de jamón regalar según la ocasión?

### Para Navidad o Reyes

Es la época del año donde más se regala jamón. Recomendamos:
- **Jamón de cebo de campo**: Perfecto para regalar sin desorbitar el presupuesto
- **Pack de loncheados variados**: Ideal si el destinatario no tiene jamonero

### Para un detalle empresarial

- **Cesta gourmet** con jamón loncheado, aceite y otros productos extremeños
- Presupuesto desde 30€ a 100€ por detalle

### Para un cumpleaños o celebración especial

- **Jamón de bellota**: Si quieres impresionar y el presupuesto lo permite
- **Jamón de cebo de campo 75%**: Excelente opción de gama alta a precio contenido

## Cómo presentar el jamón como regalo

- **En su estuche original**: Nuestros envases al vacío son elegantes y presentables
- **Acompañado de un cuchillo jamonero**: Un detalle extra muy útil
- **Con una tarjeta personalizada**: Explica el origen y la calidad del producto

## ¿Por qué regalar nuestro jamón?

- **Cortado a cuchillo** por maestro jamonero, no a máquina
- **Envasado al vacío** en paquetes individuales
- **75% Raza Ibérica** de la mejor calidad
- **Envío a domicilio** directamente desde Extremadura
- **Pago seguro** y atención personalizada por WhatsApp

## Presupuestos para regalar jamón

| Tipo | Precio | Ideal para |
| --- | --- | --- |
| Jamón cebo campo loncheado | ~25-30€ | Regalo informal, detalle empresa |
| Lote gourmet completo | ~50€ | Regalo especial |
| Jamón de bellota loncheado | ~60-80€ | Ocasión muy especial |

Contacta con nosotros por WhatsApp y te ayudamos a elegir el mejor regalo.`,
    category: 'Guía de compra',
    tags: ['jamón para regalo', 'regalar jamón ibérico', 'cesta gourmet', 'jamón navidad', 'detalle empresa jamón'],
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
