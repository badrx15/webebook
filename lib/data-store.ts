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
