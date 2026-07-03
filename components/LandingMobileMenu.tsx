'use client';

import { useState } from 'react';

export default function LandingMobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <a href="#productos" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-red-700 py-2">Productos</a>
            <a href="#calidad" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-red-700 py-2">Calidad</a>
            <a href="#testimonios" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-red-700 py-2">Opiniones</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-red-700 py-2">Contacto</a>
          </div>
        </div>
      )}
    </>
  );
}
