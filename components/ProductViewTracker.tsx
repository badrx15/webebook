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
    if (products.length === 0) return;

    // Single ViewContent event with all products (Meta Pixel recommended approach)
    const totalValue = products.reduce((sum, p) => sum + p.sellingPrice, 0);
    trackViewContent({
      content_ids: products.map(p => p.id),
      content_name: products.map(p => p.name).join(', '),
      content_type: 'product_group',
      value: totalValue,
      currency: 'EUR',
    });
  }, [products]);

  return null;
}
