import type { AppData } from './types';
import { put, list } from '@vercel/blob';
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 7: Historia del jamón ibérico ---
  {
    id: 'seed-7',
    slug: 'historia-del-jamon-iberico-tradicion-milenaria',
    title: 'Historia del jamón ibérico: una tradición milenaria',
    excerpt: 'Descubre los orígenes del jamón ibérico, desde la prehistoria hasta la actualidad. Una tradición que se remonta a más de 4.000 años.',
    content: `## Los orígenes del jamón ibérico

La historia del jamón ibérico se remonta a tiempos ancestrales. Ya en la prehistoria, los pobladores de la Península Ibérica domesticaban cerdos y aprovechaban su carne. La necesidad de conservar los alimentos durante los meses de invierno llevó al descubrimiento de la salazón, técnica que daría origen al jamón.

## La llegada de los fenicios y el arte de la salazón

Fueron los fenicios, comerciantes llegados del Mediterráneo oriental, quienes introdujeron técnicas avanzadas de salazón en la Península Ibérica alrededor del año 1.000 a.C. Estos conocimientos se fusionaron con la tradición local, dando lugar a los primeros jamones curados tal y como los conocemos.

## El cerdo ibérico: una raza única

El cerdo ibérico es una raza autóctona de la Península que se ha criado en la dehesa durante siglos. Su capacidad para infiltrar grasa en el músculo (lo que conocemos como vetas de grasa) es lo que hace que su carne sea tan sabrosa y jugosa.

### La dehesa: ecosistema único

La dehesa es un ecosistema único en el mundo, formado por encinas y alcornoques, donde los cerdos ibéricos viven en libertad. Este paisaje, declarado Reserva de la Biosfera por la UNESCO, es el secreto del sabor inconfundible del jamón ibérico.

## La época romana

Los romanos, grandes amantes de la gastronomía, apreciaban enormemente los jamones de la Península Ibérica. En sus escritos, autores como Catón el Viejo y Plinio el Viejo ya alababan la calidad de estos productos, que se exportaban a todo el Imperio Romano.

## La Edad Media y la tradición judía

Durante la Edad Media, el jamón ibérico adquirió un simbolismo especial. Los cristianos viejos utilizaban el consumo de jamón como una forma de demostrar que no eran judíos ni musulmanes (religiones que no consumen cerdo). Curiosamente, esto contribuyó a que la tradición jamonera se mantuviera viva durante siglos.

## La denominación de origen

En 1991 se creó la primera Denominación de Origen Protegida (DOP) para el jamón ibérico, lo que supuso un antes y un después en la regulación de la calidad. Hoy existen cuatro DOP principales:

- **DOP Guijuelo** (Salamanca)
- **DOP Dehesa de Extremadura**
- **DOP Jamón de Jabugo** (Huelva)
- **DOP Los Pedroches** (Córdoba)

## El jamón ibérico en el siglo XXI

Hoy en día, el jamón ibérico es uno de los productos más valorados de la gastronomía española en todo el mundo. La tecnología ha permitido mejorar los procesos de curación y envasado al vacío, llevando este manjar a cualquier rincón del planeta sin perder un ápice de su calidad.

En Ibéricos Gourmet seguimos esta tradición milenaria con la misma pasión que los antiguos maestros jamoneros, combinando técnicas tradicionales con las mejores prácticas de conservación para ofrecerte un producto excepcional.`,
    category: 'Producto',
    tags: ['historia del jamón ibérico', 'origen jamón ibérico', 'tradición jamonera', 'dehesa extremeña', 'denominación de origen'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 8: Beneficios del jamón ibérico para la salud ---
  {
    id: 'seed-8',
    slug: 'beneficios-del-jamon-iberico-para-la-salud',
    title: 'Beneficios del jamón ibérico para la salud: mitos y realidades',
    excerpt: '¿Es el jamón ibérico saludable? Te contamos todos sus beneficios nutricionales: ácido oleico, proteínas de calidad, vitaminas y minerales.',
    content: `## ¿El jamón ibérico es saludable?

Durante años se ha extendido el mito de que el jamón es un alimento poco saludable por su contenido en grasa. Nada más lejos de la realidad. El jamón ibérico, especialmente el de bellota y cebo de campo, es un alimento con múltiples beneficios para la salud.

## Ácido oleico: la grasa buena

La grasa del jamón ibérico es rica en ácido oleico, el mismo tipo de grasa monoinsaturada que encontramos en el aceite de oliva virgen extra. Este tipo de grasa:

- Ayuda a reducir el colesterol LDL (malo)
- Aumenta el colesterol HDL (bueno)
- Contribuye a la salud cardiovascular
- Tiene propiedades antiinflamatorias

## Proteínas de alta calidad

El jamón ibérico es una excelente fuente de proteínas de alto valor biológico. Por cada 100 gramos, aporta aproximadamente:

- **30-35 gramos** de proteínas
- Todos los aminoácidos esenciales que nuestro cuerpo necesita
- Ideal para deportistas y personas activas

## Vitaminas y minerales

El jamón ibérico es rico en vitaminas del grupo B, especialmente:

- **Vitamina B1 (Tiamina)**: Importante para el metabolismo energético
- **Vitamina B3 (Niacina)**: Ayuda a mantener la piel sana y el sistema nervioso
- **Vitamina B6**: Fundamental para el desarrollo cerebral
- **Vitamina B12**: Esencial para la formación de glóbulos rojos

Además, es una buena fuente de minerales como:

- **Hierro**: Previene la anemia
- **Zinc**: Refuerza el sistema inmunológico
- **Fósforo**: Importante para huesos y dientes
- **Potasio**: Ayuda a regular la tensión arterial

## ¿Es apto para dietas?

El jamón ibérico puede formar parte de una dieta equilibrada:

- **Dieta keto y baja en carbohidratos**: Es perfecto porque no contiene hidratos de carbono
- **Dieta mediterránea**: Es un alimento tradicional de esta dieta, considerada la más saludable del mundo
- **Dieta para deportistas**: Su alto contenido proteico ayuda a la recuperación muscular

## ¿Engorda el jamón ibérico?

Con moderación, el jamón ibérico no engorda. Una ración de 50 gramos aporta aproximadamente:

- **120-150 calorías**
- Similar a un yogur desnatado con cereales
- Mucho más saciante que otros aperitivos

## Contraindicaciones

Eso sí, las personas con hipertensión deben moderar su consumo debido al contenido en sal del proceso de curación. También se recomienda consultar con un médico durante el embarazo, aunque el jamón ibérico de bellota de calidad está sometido a controles sanitarios exhaustivos.

**Conclusión**: El jamón ibérico, consumido con moderación dentro de una dieta equilibrada, es un alimento saludable con múltiples beneficios. En Ibéricos Gourmet seleccionamos las mejores piezas para que disfrutes de un producto delicioso y nutritivo.`,
    category: 'Consejos',
    tags: ['beneficios jamón ibérico', 'jamón ibérico saludable', 'ácido oleico', 'propiedades del jamón', 'jamón en la dieta'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 9: Cómo cortar jamón ibérico a cuchillo ---
  {
    id: 'seed-9',
    slug: 'como-cortar-jamon-iberico-a-cuchillo',
    title: 'Cómo cortar jamón ibérico a cuchillo: guía para cortes perfectos',
    excerpt: 'Aprende la técnica del corte a cuchillo del jamón ibérico. Consejos sobre utensilios, temperatura y la técnica del maestro jamonero.',
    content: `## El arte del corte a cuchillo

Cortar jamón ibérico a cuchillo es todo un arte que requiere práctica y paciencia. Un buen corte no solo mejora la presentación, sino que realza el sabor y la textura del jamón. Te enseñamos las claves para conseguirlo.

## Utensilios necesarios

### El jamonero

El jamonero es el soporte que sujeta la pieza de jamón. Debe ser:
- **Estable**: Con base ancha que no se deslice
- **Ajustable**: Que permita girar la pieza según avanza el corte
- De acero inoxidable o madera de calidad

### El cuchillo jamonero

Necesitarás dos tipos de cuchillo:

- **Cuchillo de corte largo y flexible**: Para las lonchas. Debe tener una hoja de al menos 25-30 cm.
- **Cuchillo de despiece o cuchilla corta**: Para acceder a zonas complicadas y deshuesar.

Mantener los cuchillos bien afilados es fundamental para obtener lonchas perfectas.

### El afilador

Un acero o piedra de afilar debe estar siempre a mano. Un cuchillo desafilado desgarrará la carne en lugar de cortarla limpiamente.

## Temperatura ideal del jamón

Antes de empezar a cortar, el jamón debe estar a **temperatura ambiente**:

- Sácalo del frigorífico **30-40 minutos antes** de cortarlo
- La temperatura ideal está entre **20°C y 24°C**
- A esta temperatura, la grasa se ablanda y el corte es más limpio
- El aroma y el sabor se aprecian mucho mejor

## La técnica paso a paso

### 1. Colocación del jamón

Coloca el jamón en el jamonero con la pezuña hacia arriba y la punta hacia abajo. La parte más estrecha (babilla) debe quedar hacia el lado que va a cortar primero.

### 2. Primer corte: abrir el jamón

Retira la corteza exterior y la grasa amarilla de la superficie con un corte horizontal. Deja una capa fina de grasa para proteger la carne.

### 3. Las lonchas

- Coge el cuchillo de corte largo con firmeza pero sin tensión
- Realiza movimientos largos y suaves, de atrás hacia adelante
- Las lonchas deben ser finas (2-3 mm de grosor), casi transparentes
- Corta siempre en la misma dirección, no serrando

### 4. Zona de corte

Empieza por la parte más ancha (la maza) y ve avanzando hacia la babilla. Cuando la zona de corte se vuelva irregular, gira el jamón en el jamonero.

## Errores comunes

- **Cortar demasiado grueso**: Las lonchas deben ser finas para que se deshagan en la boca
- **Serrar en lugar de deslizar**: El movimiento debe ser limpio, de una sola dirección
- **No afilar el cuchillo**: Un cuchillo sin filo rompe la fibra y la loncha se desgarra
- **Jamón demasiado frío**: La grasa fría se rompe y el corte es irregular

## Cómo presentar el jamón

Las lonchas deben servirse en un plato o tabla, extendidas sin amontonarlas. Lo ideal es colocarlas de una en una, solapándolas ligeramente para que sea fácil cogerlas.

En Ibéricos Gourmet cortamos nuestro jamón a cuchillo siguiendo estas técnicas tradicionales para que recibas las lonchas en su punto óptimo de sabor y textura.`,
    category: 'Consejos',
    tags: ['cortar jamón ibérico', 'cuchillo jamonero', 'técnica corte jamón', 'jamonero', 'cómo cortar jamón'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 10: Maridaje del jamón ibérico con vino ---
  {
    id: 'seed-10',
    slug: 'maridaje-jamon-iberico-vino-tinto-blanco-cava',
    title: 'Maridaje perfecto: qué vino acompañar con jamón ibérico',
    excerpt: 'Descubre los mejores maridajes para el jamón ibérico. Vinos tintos, blancos y cavas que realzan su sabor y convierten cada bocado en una experiencia única.',
    content: `## El arte del maridaje con jamón ibérico

Acompañar el jamón ibérico con el vino adecuado puede transformar una simple degustación en una experiencia gastronómica inolvidable. Cada tipo de jamón tiene su maridaje ideal.

## Maridaje según el tipo de jamón

### Jamón de Bellota

El jamón de bellota, con su sabor intenso y su grasa rica en ácido oleico, requiere vinos con personalidad:

- **Vino tinto crianza o reserva** de Ribera del Duero o Rioja
- **Un fino o manzanilla** de Jerez, el maridaje clásico andaluz
- **Un cava brut nature** largo en crianza

### Jamón de Cebo de Campo (nuestro jamón)

Nuestro jamón de cebo de campo 75% raza ibérica, con su sabor equilibrado y textura suave, admite:

- **Vino tinto joven** con personalidad frutal
- **Un rosado** de Ribera del Duero o Navarra
- **Un blanco con cuerpo** como un Rueda fermentado en barrica
- **Un cava brut** que limpie el paladar entre bocados

## Los maridajes clásicos

### Vino tinto + Jamón ibérico

El maridaje por excelencia. Recomendamos:

- **Rioja Crianza**: La combinación más clásica. Sus taninos suaves complementan la grasa del jamón.
- **Ribera del Duero**: Un vino con cuerpo que aguanta bien el sabor potente del jamón.
- **Priorato**: Para ocasiones especiales, su potencia aromática casa a la perfección.

### Fino o Manzanilla + Jamón ibérico

El maridaje tradicional de Andalucía. El fino, seco y con un toque salino, limpia el paladar y prepara para el siguiente bocado. La manzanilla, más ligera, es perfecta para tardes de verano.

### Cava + Jamón ibérico

El cava brut nature, con su burbuja fina y su acidez equilibrada, es ideal para:
- Aperitivos y celebraciones
- Contrastar la untuosidad del jamón
- Maridajes sorprendentes y elegantes

## ¿Y el jamón en la cocina?

Si cocinas con jamón ibérico, el maridaje cambia:

- **Croquetas de jamón**: Un blanco de Rueda o un cava
- **Huevos rotos con jamón**: Un tinto joven de la tierra
- **Melón con jamón**: Un Pedro Ximénez dulce o un cava semi-seco

## La temperatura de servicio

Tanto el jamón como el vino deben servirse a la temperatura adecuada:

- **Jamón ibérico**: 20-24°C (temperatura ambiente)
- **Tinto joven**: 14-16°C
- **Tinto crianza**: 16-18°C
- **Blanco/Rosado**: 8-10°C
- **Cava**: 6-8°C
- **Fino/Manzanilla**: 8-10°C

## Consejo final

La mejor regla del maridaje es la que te hace disfrutar. No tengas miedo de experimentar. En Ibéricos Gourmet, nuestro jamón de cebo de campo combina de maravilla con un buen tinto de Ribera del Duero o con un cava bien frío para sorprender a tus invitados.`,
    category: 'Recetas',
    tags: ['maridaje jamón ibérico', 'vino y jamón', 'qué vino con jamón', 'maridaje jamón vino tinto', 'cava y jamón'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 11: La dehesa extremeña y el jamón ---
  {
    id: 'seed-11',
    slug: 'la-dehesa-extremena-ecosistema-del-jamon-iberico',
    title: 'La dehesa extremeña: el ecosistema que hace único al jamón ibérico',
    excerpt: 'Descubre la dehesa extremeña, un ecosistema único en el mundo donde los cerdos ibéricos pastan en libertad. El secreto del mejor jamón está en la tierra.',
    content: `## ¿Qué es la dehesa?

La dehesa es un ecosistema único en el mundo, un bosque mediterráneo transformado por el ser humano durante siglos para el pastoreo. Se extiende por el suroeste de la Península Ibérica, abarcando principalmente Extremadura, oeste de Andalucía, Castilla y León y el Alentejo portugués.

Extremadura cuenta con más de **1,2 millones de hectáreas de dehesa**, lo que la convierte en la mayor zona de dehesa de España y el corazón del jamón ibérico.

## Los árboles de la dehesa: encinas y alcornoques

La dehesa se compone principalmente de dos tipos de árboles:

### La encina

- Árbol perenne de hoja dura
- Produce bellotas dulces, las favoritas del cerdo ibérico
- Puede vivir hasta 500 años
- Su bellota es más pequeña y dulce que la del alcornoque

### El alcornoque

- También perenne, de corteza gruesa (corcho)
- Su bellota es más amarga y grande
- Se aprovecha cada 9-12 años para extraer el corcho

## La montanera: la época más importante del año

La montanera es el período entre octubre y febrero en el que los cerdos ibéricos pastan libremente en la dehesa alimentándose de bellotas, hierbas y raíces. Durante esta época:

- Un cerdo puede recorrer hasta **10 km al día** en busca de bellotas
- Llega a consumir entre **10 y 12 kg de bellotas al día**
- Engorda entre **50 y 60 kg** durante la montanera
- El ejercicio constante contribuye a la infiltración de la grasa en el músculo

## ¿Por qué la bellota es tan importante?

La bellota es el secreto del sabor del jamón ibérico. Es rica en:

- **Ácido oleico**: La grasa saludable que aporta untuosidad y sabor
- **Hidratos de carbono complejos**: Que el cerdo transforma en grasa infiltrada
- **Taninos**: Que aportan matices amargos y complejidad al jamón

## La raza ibérica: adaptada a la dehesa

El cerdo ibérico es una raza autóctona perfectamente adaptada a la vida en la dehesa:

- **Pezuñas negras**: Adaptadas para caminar largas distancias
- **Hocico largo y fuerte**: Ideal para escarbar y encontrar raíces y pequeños animales
- **Capacidad de infiltrar grasa**: Genéticamente predispuesto a acumular grasa entre las fibras musculares, creando el característico veteado

## Un ecosistema en equilibrio

La dehesa es un ejemplo de desarrollo sostenible:

- Los árboles proporcionan sombra y alimento a los cerdos
- Los cerdos abonan la tierra y dispersan semillas
- Se mantiene un equilibrio que favorece la biodiversidad
- Está declarada como **Sistema Importante del Patrimonio Agrícola Mundial** por la FAO

## Ibéricos Gourmet y la dehesa extremeña

Nuestro jamón de cebo de campo 75% raza ibérica proviene de cerdos criados en las dehesas extremeñas, donde se alimentan de pastos naturales y piensos seleccionados. Aunque no sea de bellota, la calidad de la dehesa extremeña se refleja en cada loncha.

Cuando compras nuestro jamón, estás llevando a tu mesa un producto que lleva siglos de tradición y el sabor de uno de los ecosistemas más bellos y valiosos de España.`,
    category: 'Producto',
    tags: ['dehesa extremeña', 'ecosistema dehesa', 'montanera', 'encina', 'cerdo ibérico en la dehesa', 'bellota'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 12: Jamón de bellota vs cebo de campo ---
  {
    id: 'seed-12',
    slug: 'jamon-iberico-bellota-vs-cebo-campo-diferencias',
    title: 'Jamón ibérico de bellota vs cebo de campo: diferencias clave para acertar en tu compra',
    excerpt: '¿Cuál es la diferencia real entre un jamón de bellota y uno de cebo de campo? Te explicamos las claves para elegir el que mejor se adapta a ti.',
    content: `## La gran pregunta: ¿bellota o cebo de campo?

A la hora de comprar jamón ibérico, una de las dudas más frecuentes es si merece la pena pagar más por un jamón de bellota o si un buen cebo de campo es suficiente. La respuesta depende de varios factores que analizamos en detalle.

## Diferencias clave

### Alimentación

La diferencia principal está en la alimentación durante los últimos meses de vida del cerdo:

- **Bellota**: El cerdo se alimenta exclusivamente de bellotas, hierbas y raíces durante la montanera (octubre-febrero). Consume entre 10 y 12 kg de bellotas al día.
- **Cebo de campo**: El cerdo se cría en libertad en la dehesa pero su alimentación se complementa con piensos naturales y pastos. No hay montanera.

### Sabor

- **Bellota**: Sabor intenso y complejo con notas a frutos secos y un característico sabor a bellota. La grasa se funde en la boca.
- **Cebo de campo**: Sabor suave y equilibrado, sabroso pero menos complejo. Textura más firme.

### Precio

- **Bellota 100%**: 80-200€/kg
- **Bellota 50-75%**: 50-90€/kg
- **Cebo de campo 50-75%**: 25-45€/kg — la mejor relación calidad-precio

### Textura

- **Bellota**: Grasa muy infiltrada, textura untuosa que se deshace. Veteado muy marcado.
- **Cebo de campo**: Grasa menos infiltrada pero de buena calidad. Textura firme y agradable.

## ¿Para quién es cada uno?

### Elige jamón de bellota si...

- Vas a celebrar una ocasión especial
- Quieres hacer un regalo de alto nivel
- Eres un sibarita que busca la máxima expresión del jamón
- Tu presupuesto te lo permite sin problema

### Elige jamón de cebo de campo si...

- Quieres calidad para el consumo diario
- Buscas la mejor relación calidad-precio
- Vas a cocinar con él (croquetas, revueltos, etc.)
- Quieres un jamón versátil para cualquier ocasión

## ¿Merece la pena pagar más por el bellota?

La respuesta honesta es: depende. El jamón de bellota es objetivamente superior en sabor y textura, pero la diferencia de precio es considerable. Nuestro jamón de cebo de campo 75% raza ibérica ofrece una calidad excelente que satisface incluso a los paladares más exigentes, a un precio que permite disfrutarlo con regularidad.

**Conclusión**: Para el día a día, un buen cebo de campo es la opción inteligente. Para celebraciones o caprichos, el bellota es una experiencia que hay que probar al menos una vez.`,
    category: 'Guía de compra',
    tags: ['jamón bellota vs cebo campo', 'diferencia jamón ibérico', 'comprar jamón ibérico', 'bellota o cebo', 'calidad jamón ibérico'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 13: Cómo conservar el jamón después de abierto ---
  {
    id: 'seed-13',
    slug: 'como-conservar-jamon-iberico-despues-de-abrirlo',
    title: 'Cómo conservar el jamón ibérico después de abrirlo: guía práctica',
    excerpt: 'Una vez abierto el envase, el jamón necesita cuidados especiales. Aprende a conservarlo para que dure más tiempo en perfectas condiciones.',
    content: `## ¿Cuánto dura el jamón ibérico una vez abierto?

Una vez abierto el envase al vacío (o empezado un jamón entero), el tiempo de consumo recomendado varía:

- **Loncheado envasado al vacío**: 3-5 días después de abrir
- **Jamón entero (empezado)**: 2-3 meses si se conserva correctamente
- **Loncheado suelto**: 1-2 días a temperatura adecuada

## Cómo conservar el jamón loncheado

### Método 1: Envase al vacío reutilizable

Si tienes una envasadora al vacío, es el mejor método. Vuelve a envasar las lonchas sobrantes y se conservarán hasta 15 días más.

### Método 2: Papel de horno + film

- Coloca las lonchas en una capa uniforme
- Envuélvelas primero en papel de horno (absorbe la humedad)
- Luego envuélvelas en film transparente
- Guárdalas en la parte menos fría del frigorífico

### Método 3: Recipiente hermético

- Coloca las lonchas separadas con papel de horno entre capas
- Usa un recipiente hermético de cristal o plástico alimentario
- Añade un trozo de papel de cocina en el fondo para absorber humedad

## Cómo conservar un jamón entero empezado

Si tienes un jamón entero en jamonero, la conservación cambia:

### Paso 1: El corte

Siempre debes dejar una capa fina de grasa sobre la superficie de corte para proteger la carne del aire.

### Paso 2: Cubrir la zona de corte

Después de cada uso:
1. Cubre la superficie de corte con un paño de algodón limpio (el tradicional "paño de jamón")
2. También funciona papel de horno o film transparente
3. Sujeta la cobertura con una goma elástica alrededor del jamón

### Paso 3: Temperatura

- Guarda el jamón en un lugar fresco, seco y oscuro
- La temperatura ideal es entre 15°C y 20°C
- Evita cambios bruscos de temperatura
- No lo guardes en el frigorífico si consumes con regularidad

## Qué NO hacer

- ❌ No envolver el jamón en plástico directamente sobre la carne (sudará)
- ❌ No guardarlo en el frigorífico muy cerca del congelador (demasiado frío)
- ❌ No exponerlo a la luz directa del sol
- ❌ No dejar la grasa protectora descubierta (se seca y se pone rancio)

## Señales de que el jamón está en mal estado

- Olor agrio o desagradable
- Moho superficial (si es blanco, se puede limpiar; si es verde o negro, deséchelo)
- Textura viscosa o pegajosa
- Sabor ácido o extraño

En Ibéricos Gourmet envasamos nuestro jamón loncheado al vacío para que llegue en perfectas condiciones. Una vez abierto, sigue estos consejos y disfruta de cada loncha como el primer día.`,
    category: 'Consejos',
    tags: ['conservar jamón abierto', 'jamón después de abrir', 'cuánto dura jamón', 'guardar jamón', 'conservación jamón entero'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 14: Recetas navideñas con jamón ibérico ---
  {
    id: 'seed-14',
    slug: 'recetas-navidenas-con-jamon-iberico',
    title: 'Recetas navideñas con jamón ibérico para triunfar estas fiestas',
    excerpt: 'Sorprende a tus invitados estas navidades con estas 4 recetas espectaculares con jamón ibérico. Entrantes, platos principales y aperitivos.',
    content: `## El jamón ibérico en Navidad

La Navidad es la época perfecta para disfrutar del jamón ibérico. Ya sea como aperitivo, en entrantes o como parte del plato principal, el jamón ibérico siempre es un acierto en la mesa navideña.

## 1. Canapés de jamón ibérico con queso de cabra y membrillo

Un entrante rápido y elegante:

- Tuesta rebanadas de pan de pueblo o pan de cristal
- Unta una capa de queso de cabra cremoso
- Añade una cucharadita de membrillo
- Coloca una loncha de jamón ibérico doblada sobre el membrillo
- Decora con un poco de pimienta negra y unas hojas de rúcula

Tiempo: 10 minutos | Dificultad: Fácil

## 2. Carpaccio de solomillo con virutas de jamón ibérico

Un plato sorprendente:

- Congela un solomillo de ternera 30 minutos para facilitar el corte
- Córtalo en láminas finísimas con un cuchillo bien afilado
- Coloca las láminas en un plato extendidas
- Aliña con aceite de oliva virgen extra, limón, sal y pimienta
- Añade virutas de jamón ibérico por encima
- Termina con lascas de parmesano y piñones tostados

Tiempo: 20 minutos | Dificultad: Media

## 3. Pimientos del piquillo rellenos de jamón ibérico

Un clásico navideño reinventado:

- Prepara un relleno con: jamón ibérico picado, queso crema, nueces picadas y un toque de miel
- Rellena los pimientos del piquillo con la mezcla
- Colócalos en una bandeja de horno
- Cúbrelos con una salsa de tomate casera y un poco de queso rallado
- Gratínalos 5 minutos a 200°C
- Sirve caliente decorado con cebollino fresco

Tiempo: 25 minutos | Dificultad: Media

## 4. Lombarda salteada con jamón ibérico y piñones

Un plato tradicional actualizado:

- Corta una lombarda en juliana fina
- Pocha una cebolla en aceite de oliva
- Añade la lombarda y saltéala 10 minutos
- Incorpora un chorrito de vinagre de Módena y una cucharada de azúcar moreno
- Saltea 5 minutos más hasta que esté tierna
- Fuera del fuego, añade jamón ibérico troceado y piñones tostados

Este plato combina perfectamente con carnes asadas.

## Maridaje para la cena navideña

- **Entrantes**: Cava brut nature o un fino de Jerez
- **Plato principal**: Rioja reserva o Ribera del Duero
- **Postre**: Pedro Ximénez dulce

## Tabla de ibéricos para Nochevieja

No hay mejor manera de recibir el año nuevo que con una tabla de ibéricos con:

- Jamón ibérico de cebo de campo loncheado
- Lomo ibérico
- Queso curado de oveja
- Membrillo
- Frutos secos
- Pan de cristal con tomate

En Ibéricos Gourmet tenemos packs navideños especiales con una selección de nuestros mejores productos. ¡Perfectos para compartir en familia!`,
    category: 'Recetas',
    tags: ['recetas navideñas jamón ibérico', 'navidad jamón', 'canapés navidad', 'cena nochebuena jamón', 'aperitivos navidad jamón ibérico'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 15: Lomo ibérico ---
  {
    id: 'seed-15',
    slug: 'lomo-iberico-tipos-como-disfrutarlo-guia-completa',
    title: 'Lomo ibérico: el otro manjar de la dehesa, tipos y cómo disfrutarlo',
    excerpt: 'El lomo ibérico es uno de los embutidos más apreciados. Descubre sus tipos (bellota, cebo de campo), cómo se elabora y las mejores formas de degustarlo.',
    content: `## ¿Qué es el lomo ibérico?

El lomo ibérico es un embutido curado elaborado a partir del lomo del cerdo ibérico, la parte más magra y tierna del animal. Se sala, se adoba con pimentón y ajo, y se cura lentamente durante semanas o meses, dependiendo del tipo.

## Tipos de lomo ibérico

### Lomo de Bellota

Procedente de cerdos alimentados con bellotas durante la montanera. Es el lomo de máxima calidad:

- **Sabor**: Intenso, con matices a bellota y especias
- **Textura**: Jugosa, con infiltración de grasa que se funde
- **Precio**: 40-70€/kg
- **Curación**: Mínimo 3 meses

### Lomo de Cebo de Campo

De cerdos criados en libertad en la dehesa con alimentación natural. Nuestro lomo pertenece a esta categoría:

- **Sabor**: Equilibrado, suave y sabroso
- **Textura**: Firme pero tierna, con el punto justo de jugosidad
- **Precio**: 20-35€/kg — excelente relación calidad-precio
- **Curación**: 2-3 meses

### Lomo de Cebo

De cerdos criados en granja. Es la opción más económica:
- **Sabor**: Suave, menos intenso
- **Precio**: 15-20€/kg

## Elaboración artesanal

El proceso de elaboración del lomo ibérico es todo un arte:

1. **Selección**: Se escogen los lomos de la mejor calidad
2. **Desgrasado**: Se elimina el exceso de grasa superficial
3. **Adobo**: Se adoba con pimentón, ajo, orégano y sal durante 24-48 horas
4. **Embutido**: Se introduce en tripa natural y se ata con cuerda
5. **Curación**: Se cuelga en secaderos naturales durante 2-4 meses
6. **Maduración**: El frío del invierno y el calor de la primavera le dan su punto óptimo

## Cómo degustar el lomo ibérico

### En lonchas finas

- Córtalo en lonchas finas, casi transparentes
- Sácalo del frigorífico 15 minutos antes de servir
- Acompáñalo con pan con tomate y aceite de oliva

### En tablas de embutidos

El lomo ibérico es imprescindible en cualquier tabla de ibéricos junto con:
- Jamón ibérico
- Chorizo ibérico
- Salchichón ibérico
- Queso curado

### En la cocina

El lomo ibérico también se usa en cocina:

- **Revueltos**: Añádelo troceado a huevos revueltos
- **Ensaladas**: Combínalo con rúcula, parmesano y vinagreta balsámica
- **Pizzas gourmet**: Sustituye el pepperoni por lomo ibérico
- **Sándwiches**: Un sándwich de lomo ibérico con queso manchego es espectacular

## Dónde comprar lomo ibérico online

En Ibéricos Gourmet también tenemos lomo ibérico de cebo de campo, cortado a cuchillo y envasado al vacío. Perfecto para tener siempre en casa un embutido de calidad para aperitivos y comidas.`,
    category: 'Producto',
    tags: ['lomo ibérico', 'embutidos ibéricos', 'lomo de bellota', 'lomo de cebo de campo', 'tabla de ibéricos', 'comprar lomo ibérico'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 16: Preguntas frecuentes sobre jamón ibérico ---
  {
    id: 'seed-16',
    slug: 'preguntas-frecuentes-sobre-jamon-iberico',
    title: 'Preguntas frecuentes sobre el jamón ibérico: resuelve todas tus dudas',
    excerpt: 'Las dudas más comunes sobre el jamón ibérico resueltas: ¿se puede congelar?, ¿cuánto dura?, ¿cómo se corta?, ¿por qué es caro? y mucho más.',
    content: `## Las preguntas más frecuentes sobre jamón ibérico

Hemos recopilado las dudas más habituales de nuestros clientes y las respondemos de forma clara y directa.

## Sobre conservación

### ¿Se puede congelar el jamón ibérico?

Sí, el jamón ibérico se puede congelar sin problemas. Lo recomendable es hacerlo en porciones individuales envasadas al vacío. Se conserva hasta 3 meses en el congelador. Para descongelarlo, pásalo al frigorífico 24 horas antes de consumirlo.

### ¿Cuánto dura el jamón ibérico en la nevera?

- **Envasado al vacío sin abrir**: Hasta 6 meses desde la fecha de envasado
- **Abierto**: 3-5 días en el frigorífico, envuelto en papel de horno
- **Jamón entero empezado**: 2-3 meses si se cubre bien la zona de corte

### ¿Se puede comer la grasa del jamón ibérico?

¡Por supuesto! La grasa del jamón ibérico es la parte más apreciada por los entendidos. Es rica en ácido oleico (grasa saludable) y aporta la mayor parte del sabor. Cómetela sin remordimientos.

## Sobre compra y calidad

### ¿Por qué el jamón ibérico es tan caro?

El precio se debe a varios factores:

1. **Tiempo de cría**: El cerdo ibérico tarda 2-3 veces más en crecer que un cerdo blanco
2. **Alimentación**: La bellota es un alimento caro y escaso
3. **Tiempo de curación**: Entre 24 y 48 meses para un buen jamón
4. **Espacio**: La dehesa requiere grandes extensiones de terreno
5. **Artesanía**: Maestros jamoneros altamente cualificados

### ¿Qué diferencia hay entre jamón serrano e ibérico?

- **Jamón serrano**: De cerdo blanco, alimentación con piensos, curación 7-15 meses
- **Jamón ibérico**: De cerdo ibérico, puede ser de bellota o cebo, curación 24-48 meses

El jamón ibérico tiene más infiltración de grasa, sabor más complejo y textura más jugosa.

### ¿Cómo saber si un jamón ibérico es de calidad?

Fíjate en:
- **Etiqueta**: Negra (100% bellota), Roja (bellota), Verde (cebo de campo), Blanca (cebo)
- **Veteado**: A más vetas de grasa, mejor calidad
- **Precio**: Desconfía de ofertas muy baratas
- **Origen**: Las DOP garantizan calidad

## Sobre consumo

### ¿Se puede comer jamón ibérico en el embarazo?

Sí, el jamón ibérico de bellota de calidad está sometido a controles sanitarios que garantizan su seguridad. La normativa actual permite su consumo en embarazadas siempre que provenga de jamones certificados.

### ¿El jamón ibérico tiene lactosa?

No, el jamón ibérico es naturalmente libre de lactosa. Es apto para intolerantes a la lactosa. Tampoco contiene gluten, por lo que es apto para celíacos.

### ¿Cuántas calorías tiene el jamón ibérico?

Una ración de 50g de jamón ibérico de bellota aporta aproximadamente 120-150 calorías. Es un alimento saciante y nutritivo.

## Sobre compra online

### ¿Comprar jamón ibérico online es seguro?

Sí, siempre que elijas una tienda de confianza. En Ibéricos Gourmet:
- Cortamos a cuchillo y envasamos al vacío
- Enviamos con embalaje isotérmico
- Ofrecemos pago seguro con tarjeta
- Atención personalizada por WhatsApp

### ¿Cuánto tarda el envío?

Realizamos envíos a toda España peninsular con entrega en 24-48 horas laborables.

¿Tienes alguna otra duda? Escríbenos por WhatsApp y te responderemos encantados.`,
    category: 'Consejos',
    tags: ['preguntas frecuentes jamón ibérico', 'dudas jamón ibérico', 'FAQ jamón', 'jamón ibérico información', 'cómo comprar jamón ibérico'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 17: El proceso de curación del jamón ibérico ---
  {
    id: 'seed-17',
    slug: 'proceso-curacion-jamon-iberico-paso-a-paso',
    title: 'El proceso de curación del jamón ibérico paso a paso: de la dehesa a tu mesa',
    excerpt: '¿Cómo se hace el jamón ibérico? Te explicamos todo el proceso: desde la cría del cerdo en la dehesa hasta la curación en bodegas naturales.',
    content: `## El viaje del jamón ibérico: 4 años de paciencia

El jamón ibérico no se fabrica, se elabora con paciencia y respeto por la tradición. Desde que nace el cerdo hasta que el jamón está listo para consumir pueden pasar hasta 4 o 5 años.

## Fase 1: Cría en la dehesa (18-24 meses)

El cerdo ibérico nace y se cría en la dehesa extremeña. Durante sus primeros meses:

- Vive en libertad en la dehesa
- Se alimenta de leche materna y pastos naturales
- Desarrolla su estructura ósea y muscular

## Fase 2: La montanera (3-4 meses)

Si es un cerdo de bellota, entre octubre y febrero pastará en la dehesa alimentándose de bellotas. Los cerdos de cebo de campo continúan en la dehesa pero con alimentación suplementaria.

- **Kilómetros recorridos**: Hasta 10 km diarios
- **Bellotas consumidas**: 10-12 kg al día
- **Aumento de peso**: 50-60 kg durante la montanera

## Fase 3: Sacrificio y selección

Cuando el cerdo alcanza el peso óptimo (160-180 kg), se sacrifica siguiendo estrictos controles sanitarios. Las piezas se clasifican:

- **Jamones**: Las patas traseras, las piezas más nobles
- **Paletas**: Las patas delanteras, más pequeñas (5-6 kg)
- **Lomos**: La pieza más magra
- **Embutidos**: Chorizo, salchichón, caña de lomo

## Fase 4: Salazón (1 día por kg)

Los jamones se cubren con sal marina durante aproximadamente 1 día por cada kilogramo de peso. Un jamón de 8 kg estará en salazón unos 8-10 días.

## Fase 5: Lavado y post-salar

Se lavan los jamones para eliminar el exceso de sal y se dejan reposar durante 30-60 días en cámaras a temperatura controlada. La sal se distribuye uniformemente.

## Fase 6: Secado en secaderos naturales (6-9 meses)

Los jamones se cuelgan en secaderos naturales donde el clima de la zona hace su trabajo:

- Temperatura: entre 15°C y 25°C
- Humedad: controlada naturalmente
- Tiempo: 6-9 meses de secado progresivo

## Fase 7: Maduración en bodega (12-24 meses)

Es la fase más larga e importante. Los jamones pasan a bodegas subterráneas naturales donde:

- La temperatura es constante (15-18°C)
- La humedad es alta (70-80%)
- Se desarrollan los aromas y sabores complejos
- El jamón pierde peso de forma gradual (pérdida del 35-40%)

## Fase 8: Calado y control de calidad

Un maestro jamonero "cala" el jamón con una aguja de hueso para comprobar:

- El aroma (debe ser intenso y agradable)
- La textura (debe ser firme pero flexible)
- El punto de curación (ni verde ni pasado)

## Fase 9: Cortado y envasado

Una vez aprobado, el jamón se corta a cuchillo (como hacemos en Ibéricos Gourmet) y se envasa al vacío para conservar todas sus propiedades hasta que llegue a tu casa.

**Tiempo total estimado**:

| Tipo | Tiempo mínimo |
| --- | --- |
| Jamón de cebo | 18-24 meses |
| Jamón de cebo de campo | 24-30 meses |
| Jamón de bellota | 30-36 meses |
| Jamón de bellota 100% | 36-48 meses |

Cada vez que disfrutas de una loncha de nuestro jamón, estás saboreando años de trabajo, tradición y paciencia.`,
    category: 'Producto',
    tags: ['proceso curación jamón ibérico', 'cómo se hace el jamón', 'elaboración jamón', 'curación jamón paso a paso', 'montanera', 'secadero jamón'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 18: Cómo organizar una tabla de embutidos ibéricos ---
  {
    id: 'seed-18',
    slug: 'tabla-embutidos-ibericos-guia-como-montarla',
    title: 'Cómo montar una tabla de embutidos ibéricos perfecta: guía completa',
    excerpt: 'Aprende a montar una tabla de embutidos ibéricos espectacular. Qué productos incluir, cómo presentarlos y qué acompañamientos elegir.',
    content: `## El arte de la tabla de ibéricos

Una tabla de embutidos ibéricos bien montada es el centro de atención de cualquier reunión. No solo es un placer para el paladar, sino también para la vista.

## Los imprescindibles

### Jamón ibérico

El rey de la tabla. Recomendamos:

- **Cantidad**: 50-70g por persona si es el plato principal, 30-40g si es aperitivo
- **Presentación**: Lonchas extendidas, no amontonadas
- **Variedad**: Si puedes, combina lonchas de bellota y de cebo de campo para comparar sabores

### Lomo ibérico

- **Cantidad**: 30-50g por persona
- **Presentación**: Lonchas finas ligeramente dobladas
- **Acompañamiento**: Unas gotas de aceite de oliva virgen extra por encima

### Chorizo ibérico

- **Cantidad**: 20-30g por persona
- **Presentación**: En rodajas finas o en dados (depende de si es chorizo para untar o para corte)
- **Tipo**: El de bellota tiene un color más oscuro y un sabor más intenso

### Salchichón ibérico

- **Cantidad**: 20-30g por persona
- **Presentación**: Rodajas finas, con piel o sin piel según preferencia
- **Característica**: Su sabor es más suave que el del chorizo, ideal para todos los públicos

## Quesos para acompañar

Los quesos son el complemento perfecto:

- **Queso curado de oveja**: El maridaje clásico con el jamón ibérico
- **Queso manchego semicurado**: Su sabor mantecoso combina muy bien
- **Queso de cabra**: Un contraste más intenso y original
- **Idiazábal ahumado**: Para los más atrevidos

## Acompañamientos indispensables

### Pan

- Pan de cristal o pan de pueblo con tomate y aceite
- Pan con higos o frutos secos
- Picos y regañas para variar texturas

### Dulce

- **Membrillo**: El clásico, ideal con queso
- **Higos frescos o secos**: El contraste dulce-salado perfecto
- **Miel**: Un chorrito sobre el queso de cabra
- **Uvas**: Frescas y jugosas

### Otros

- **Frutos secos**: Almendras, nueces, pistachos
- **Aceitunas**: Variedad de aceitunas aliñadas
- **Pimientos del piquillo**: Asados y en tiras
- **Encurtidos**: Pepinillos, cebolletas, banderillas

## Bebidas para acompañar

- **Vino tinto joven o crianza**: Rioja o Ribera del Duero
- **Cava brut nature**: Para limpiar el paladar
- **Fino o manzanilla**: El maridaje tradicional
- **Cerveza artesanal rubia**: Opción más informal

## Consejos de presentación

1. **Tabla o bandeja**: Usa una tabla de madera, pizarra o mármol
2. **Distribución**: Coloca los embutidos separados por tipo, sin mezclar sabores
3. **Altura**: Usa cuencos pequeños para aceitunas, frutos secos, miel o membrillo
4. **Orden de consumo**: De los más suaves a los más intensos (jamón → lomo → salchichón → chorizo)
5. **Temperatura**: Saca los embutidos 15-20 minutos antes de servir
6. **Cantidad**: Calcula 150-200g de embutidos variados por persona como plato principal

En Ibéricos Gourmet tenemos packs variados de embutidos ibéricos ideales para montar tu tabla perfecta sin complicaciones.`,
    category: 'Recetas',
    tags: ['tabla de embutidos', 'tabla de ibéricos', 'cómo montar tabla de queso y embutidos', 'aperitivos con jamón', 'embutidos ibéricos tabla', 'tabla de quesos y jamón'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 19: Denominaciones de Origen del jamón ibérico ---
  {
    id: 'seed-19',
    slug: 'denominaciones-de-origen-jamon-iberico-dop',
    title: 'Denominaciones de Origen del jamón ibérico: DOP Guijuelo, Dehesa de Extremadura, Jabugo y Los Pedroches',
    excerpt: 'Las 4 Denominaciones de Origen Protegidas del jamón ibérico: Guijuelo, Dehesa de Extremadura, Jabugo y Los Pedroches. Diferencias y características.',
    content: `## ¿Qué es una Denominación de Origen Protegida?

Una DOP (Denominación de Origen Protegida) es un sello de calidad que certifica que un producto se ha elaborado siguiendo métodos tradicionales en una zona geográfica concreta, con unas materias primas y un proceso de elaboración específicos.

Para el jamón ibérico existen 4 DOP, cada una con personalidad propia.

## DOP Guijuelo (Salamanca)

**Características principales:**

- **Ubicación**: Sierra de Béjar y alrededores de Guijuelo, Salamanca
- **Clima**: Continental, con inviernos fríos y veranos suaves
- **Altitud**: 800-1.200 metros sobre el nivel del mar

**El jamón de Guijuelo:**

- Es el más suave y dulce de las 4 DOP
- Elaborado con cerdos de capa blanca o negra (50% o 75% ibérico)
- Curación mínima de 24 meses (bellota) o 18 meses (cebo)
- Sabor equilibrado, con notas dulces y poco salado
- Textura tierna y jugosa

**Dato curioso**: Guijuelo es la DOP más antigua del jamón ibérico (creada en 1991) y también la que más jamones produce.

## DOP Dehesa de Extremadura

**Características principales:**

- **Ubicación**: Extremadura (Badajoz y Cáceres principalmente)
- **Clima**: Mediterráneo continentalizado, inviernos suaves y veranos calurosos
- **Dehesa**: La mayor extensión de dehesa del mundo

**El jamón de Dehesa de Extremadura:**

- Sabor intenso y aromático, con notas a bellota y madera
- Grasa amarillenta característica por la alimentación natural
- Curación mínima de 24 meses (bellota)
- Es el jamón con mayor producción de bellota de España
- Textura firme pero jugosa, con veteado generoso

**Nuestro jamón** proviene de esta DOP. La dehesa extremeña le da ese sabor único que tanto nos gusta.

## DOP Jamón de Jabugo (Huelva)

**Características principales:**

- **Ubicación**: Sierra de Aracena y Picos de Aroche, Huelva
- **Clima**: Microclima especial, húmedo y suave todo el año
- **Altitud**: 600-1.000 metros

**El jamón de Jabugo:**

- Considerado por muchos como el mejor jamón del mundo
- Sabor muy complejo, con notas a frutos secos y hierbas aromáticas
- Grasa brillante y untuosa
- Curación mínima de 36 meses (bellota)
- Textura que se deshace en la boca

**Precio**: Es el más caro de las 4 DOP debido a su fama internacional.

## DOP Los Pedroches (Córdoba)

**Características principales:**

- **Ubicación**: Valle de Los Pedroches, Córdoba
- **Clima**: Mediterráneo continental, veranos calurosos
- **Dehesa**: Dehesa de encinas y alcornoques

**El jamón de Los Pedroches:**

- Es la DOP más joven (reconocida en 2010)
- Sabor potente y muy personal, con notas a monte y bellota
- Curación mínima de 24 meses (bellota)
- Textura firme con buena infiltración de grasa

## ¿Cuál es mejor?

No hay una DOP mejor que otra, cada una tiene su personalidad:

| DOP | Sabor | Precio | Ideal para |
| --- | --- | --- | --- |
| Guijuelo | Suave y dulce | Medio | Paladares que prefieren sabores suaves |
| Dehesa de Extremadura | Intenso y aromático | Medio-bajo | Excelente relación calidad-precio |
| Jabugo | Complejo y sofisticado | Alto | Ocasiones especiales y regalos |
| Los Pedroches | Potente y personal | Medio | Amantes de sabores intensos |

En Ibéricos Gourmet trabajamos con la DOP Dehesa de Extremadura porque creemos que ofrece la mejor relación calidad-precio del mercado. Nuestro jamón de cebo de campo 75% raza ibérica es el ejemplo perfecto de ello.`,
    category: 'Guía de compra',
    tags: ['denominación de origen jamón ibérico', 'DOP Guijuelo', 'DOP Dehesa de Extremadura', 'DOP Jabugo', 'DOP Los Pedroches', 'jamón ibérico DOP'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 20: Jamón ibérico para deportistas ---
  {
    id: 'seed-20',
    slug: 'jamon-iberico-para-deportistas-proteina-alimentacion',
    title: 'Jamón ibérico para deportistas: el aliado proteico que necesitas',
    excerpt: '¿Sabías que el jamón ibérico es un alimento ideal para deportistas? Alto en proteínas, grasas saludables y libre de azúcares. Descubre por qué debería estar en tu nevera.',
    content: `## ¿Por qué el jamón ibérico es ideal para deportistas?

El jamón ibérico es un alimento que reúne todas las características que busca un deportista: alto contenido proteico, grasas saludables, ausencia de azúcares y gran poder saciante.

## Perfil nutricional del jamón ibérico

Por cada 100 gramos:

| Nutriente | Cantidad | Beneficio |
| --- | --- | --- |
| Proteínas | 30-35g | Recuperación muscular |
| Grasas saludables | 20-25g | Energía duradera |
| Hidratos | 0g | No afecta a la glucosa |
| Calorías | ~250-300 kcal | Energía limpia |

## Beneficios para el rendimiento deportivo

### 1. Proteínas de alto valor biológico

Las proteínas del jamón ibérico contienen todos los aminoácidos esenciales que el cuerpo necesita, especialmente:

- **Leucina**: Clave para la síntesis proteica muscular
- **Valina e isoleucina**: Importantes en la recuperación post-ejercicio
- **Glutamina**: Ayuda a la recuperación del sistema inmunológico

### 2. Ácido oleico para energía sostenida

La grasa del jamón ibérico es rica en ácido oleico, una grasa monoinsaturada que proporciona energía de liberación lenta, perfecta para entrenamientos de larga duración.

### 3. Vitaminas del grupo B

El jamón ibérico es rico en vitaminas B1, B3, B6 y B12, esenciales para:
- El metabolismo energético
- La producción de glóbulos rojos
- El buen funcionamiento del sistema nervioso

### 4. Minerales clave para el deportista

- **Hierro**: Previene la anemia del deportista
- **Zinc**: Favorece la recuperación y el sistema inmunológico
- **Potasio**: Regula la hidratación celular
- **Magnesio**: Previene calambres musculares

## ¿Cuándo consumirlo?

### Antes del entrenamiento (1-2 horas antes)

Un par de lonchas de jamón ibérico con una tostada integral aportan energía limpia sin picos de glucosa.

### Después del entrenamiento (30-60 minutos después)

Las proteínas del jamón ayudan a reparar el tejido muscular dañado durante el ejercicio. Combínalo con hidratos de carbono (pan integral, fruta) para una recuperación completa.

### Como tentempié

El jamón ibérico es un snack perfecto para media mañana o media tarde. Su poder saciante evita que picotees opciones menos saludables.

## ¿Engorda el jamón ibérico si estás en definición?

No si lo consumes con moderación. Una ración de 50g aporta solo 125-150 kcal, pero sacia mucho más que otros snacks calóricos. Es perfecto para dietas de:

- **Definición**: Por su alto contenido proteico y bajo en carbohidratos
- **Volumen**: Por su densidad calórica limpia
- **Keto/Cetogénica**: Porque no contiene hidratos de carbono

## Cómo incluirlo en tu dieta deportiva

### Desayuno proteico

- 2 lonchas de jamón ibérico
- 2 huevos revueltos
- 1 tostada de pan integral
- Aguacate

### Bowl de recuperación post-entreno

- 3 lonchas de jamón ibérico troceadas
- 1 taza de quinoa cocida
- Espinacas, tomate cherry y aguacate
- Aliño de aceite de oliva y limón

### Snack pre-entreno

- 2-3 lonchas de jamón ibérico
- Un puñado de almendras
- 1 manzana

**Conclusión**: El jamón ibérico de cebo de campo, como el nuestro, es un alimento funcional para deportistas que buscan proteínas de calidad sin procesados industriales. Un producto limpio, natural y delicioso.`,
    category: 'Consejos',
    tags: ['jamón ibérico deportistas', 'proteína jamón ibérico', 'alimentación deportiva', 'comida post-entreno', 'snack proteico natural', 'dieta keto jamón'],
    published: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- Artículo 21: Cómo distinguir un buen jamón ibérico ---
  {
    id: 'seed-21',
    slug: 'como-distinguir-buen-jamon-iberico-calidad',
    title: 'Cómo distinguir un buen jamón ibérico: 7 claves para no equivocarse',
    excerpt: 'Aprende a identificar un jamón ibérico de calidad en 7 pasos. Desde el color y el veteado hasta la etiqueta y el precio. No te dejes engañar.',
    content: `## ¿Cómo saber si un jamón ibérico es de calidad?

Con tanta oferta en el mercado, es fácil perderse. Te damos 7 claves infalibles para distinguir un buen jamón ibérico de uno que no lo es.

## 1. La etiqueta de color

Es la primera y más importante señal. Las 4 etiquetas oficiales:

- **Negra**: 100% Ibérico de Bellota. La máxima calidad.
- **Roja**: Ibérico de Bellota (50-75% raza). Excelente calidad.
- **Verde**: Ibérico de Cebo de Campo. Buena relación calidad-precio.
- **Blanca**: Ibérico de Cebo. Calidad básica.

**Regla de oro**: Si la etiqueta no especifica el tipo, desconfía.

## 2. El color de la carne

Un buen jamón ibérico tiene un color característico:

- **Color**: Rojo intenso a púrpura, con vetas blancas o doradas de grasa
- **Brillo**: Debe tener un brillo natural y apetecible
- **Uniformidad**: El color debe ser homogéneo

❌ Señales de baja calidad:
- Color rosáceo pálido (típico de jamones de cebo de baja calidad)
- Color anaranjado o demasiado oscuro
- Manchas o decoloraciones

## 3. El veteado (infiltración de grasa)

La grasa infiltrada es el sello del jamón ibérico de calidad:

- **Buen jamón**: Vetas finas y numerosas de grasa entre el músculo
- **Excelente**: La grasa forma un marmolado que recorre toda la loncha
- **Malo**: Sin vetas o con vetas gruesas y separadas

La grasa infiltrada es la que aporta jugosidad y sabor. Si la loncha es completamente magra, no es un buen ibérico.

## 4. El olor

El aroma es uno de los mejores indicadores:

- **Buen jamón**: Aroma intenso a curado, con notas a frutos secos y manteca
- **Excelente**: Notas a bellota, hierbas de la dehesa y un punto tostado
- **Malo**: Olor débil, rancio o químico

Antes de comprar, si puedes, huele el producto. El jamón ibérico de calidad tiene un aroma inconfundible.

## 5. La textura al tacto y al paladar

- **Buen jamón**: Firme pero flexible. Al presionar ligeramente, recupera su forma.
- **Al paladar**: Se deshace en la boca, la grasa se funde con el calor de la lengua.
- **Malo**: Seco, fibroso, difícil de masticar.

## 6. El precio

El jamón ibérico de calidad tiene un precio mínimo:

| Tipo | Precio mínimo por kg |
| --- | --- |
| Bellota 100% | 80€ |
| Bellota 50-75% | 50€ |
| Cebo de campo | 25€ |
| Cebo básico | 12-15€ |

Si ves un "jamón ibérico" a menos de 15€/kg, probablemente no lo sea o sea de la calidad más baja.

## 7. El origen y la trazabilidad

Un buen jamón ibérico debe tener:

- **DOP**: Denominación de Origen Protegida (Guijuelo, Dehesa de Extremadura, Jabugo o Los Pedroches)
- **Información clara**: Raza del cerdo, tipo de alimentación, tiempo de curación
- **Número de lote**: Debe aparecer en el etiquetado
- **Fecha de envasado**: Para saber la frescura del producto

## Tabla resumen para comprar

| Característica | Buen jamón | Jamón básico |
| --- | --- | --- |
| Etiqueta | Negra, Roja o Verde | Blanca o sin etiqueta |
| Color | Rojo intenso | Rosáceo pálido |
| Veteado | Abundante | Escaso o nulo |
| Aroma | Intenso a curado | Débil o químico |
| Precio/kg | >25€ | <15€ |
| Origen | DOP clara | Sin especificar |

En Ibéricos Gourmet cumplimos con todos estos estándares. Nuestro jamón de cebo de campo 75% raza ibérica tiene etiqueta verde, certificado de origen DOP Dehesa de Extremadura, y un aroma y sabor que te transportarán a la dehesa extremeña.`,
    category: 'Guía de compra',
    tags: ['cómo distinguir jamón ibérico', 'calidad jamón ibérico', 'identificar buen jamón', 'comprar jamón de calidad', 'etiqueta jamón ibérico', 'jamón ibérico auténtico'],
    published: true,
    views: 0,
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
    // Ensure blogPosts is never undefined when old data doesn't have it
    blogPosts: (raw.blogPosts || DEFAULT_DATA.blogPosts).map((p: any) => ({
      ...p,
      views: p.views ?? 0, // Ensure existing posts without views get 0
    })),
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

async function getFromBlob(): Promise<AppData> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
    if (blobs.length === 0) return DEFAULT_DATA;

    const blob = blobs[0];
    const response = await fetch(blob.url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    if (!response.ok) return DEFAULT_DATA;
    const text = await response.text();
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
    await put(BLOB_PATHNAME, jsonString, {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
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
