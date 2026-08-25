'use client';

import { useEffect } from 'react';
import { trackViewContent } from '@/lib/metaPixel';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
}

export default function ProductViewTracker({ products }: { products: ProductItem[] }) {
  useEffect(() => {
    if (!products.length) return;
    trackViewContent({
      content_ids: products.map(p => p.id),
      content_name: products.map(p => p.name).join(', '),
      content_type: 'product',
      value: products.reduce((sum, p) => sum + p.sellingPrice, 0),
      currency: 'EUR',
    });
  }, [products]);

  return null;
}
