# Vende por WhatsApp — Landing Page

Landing page para el ebook **"Cómo vender por WhatsApp sin tienda online"** — construida con **Next.js 14**, **Tailwind CSS**, **TypeScript** y **Framer Motion**.

## 🚀 Arrancar en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Build de producción

```bash
npm run build
npm start
```

## ☁️ Desplegar en Vercel

1. Sube el proyecto a un repositorio en GitHub/GitLab/Bitbucket.
2. Ve a [vercel.com](https://vercel.com) e importa el repositorio.
3. Vercel detecta Next.js automáticamente — **no necesitas configuración adicional**.
4. Despliega y comparte el enlace.

También puedes desplegar directamente desde la terminal con la CLI de Vercel:

```bash
npx vercel
```

## 📁 Estructura del proyecto

```
├── app/
│   ├── globals.css       ← Estilos globales + utilidades Tailwind
│   ├── layout.tsx        ← Layout raíz con SEO metadata
│   └── page.tsx          ← Página principal (compone todas las secciones)
├── components/
│   ├── CTAButton.tsx     ← Botón CTA reutilizable (Navbar, Hero)
│   ├── Pricing.tsx      ← Botón de pago con Square Checkout
│   ├── Navbar.tsx        ← Navbar sticky transparente → oscuro
│   ├── Hero.tsx          ← Sección hero con animaciones
│   ├── Pain.tsx          ← Puntos de dolor (3 cards)
│   ├── Solution.tsx      ← Beneficios del ebook (6 cards)
│   ├── WhatYouGet.tsx    ← Contenido del ebook + mockup portada
│   ├── Testimonials.tsx  ← 3 testimonios con estrellas
│   ├── Pricing.tsx       ← Bloque de precio (17€)
│   ├── FAQ.tsx           ← Acordeón de preguntas frecuentes
│   └── Footer.tsx        ← Footer con logo, copyright, email
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

## 🎨 Diseño

- **Colores:** negro `#0d0d0d` · blanco `#ffffff` · rojo `#C0281A` · gris `#f5f5f5`
- **Tipografía:** Inter (via `next/font`)
- **Animaciones:** Framer Motion — fade-in-up en todas las secciones
- **Responsive:** mobile-first, Tailwind breakpoints

## 🔧 Personalización

- El pago ya está integrado con **Square** (API en `app/api/checkout/route.ts`). Las credenciales van en `.env.local`.
- Actualiza el email de contacto en `components/Footer.tsx` y en `app/exito/page.tsx`.
- Ajusta los metadatos SEO en `app/layout.tsx`.
