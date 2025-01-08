import { Metadata } from 'next';
import ProductsClient from './ProductsClient';
// ...existing code...

export const metadata: Metadata = {
  title: 'Productos - Cafetería del Caos',
  description: 'Explora nuestros productos en la Cafetería del Caos',
  openGraph: {
    title: 'Productos - Cafetería del Caos',
    description: 'Descubre la variedad de productos que ofrecemos en la Cafetería del Caos',
    url: 'https://cafeteriadelcaos.com/products',
  },
  keywords: ['productos', 'cafetería', 'Cafetería del Caos', 'menú'],
  alternates: {
    canonical: 'https://cafeteriadelcaos.com/products',
  }
};

// ...existing code...

export default function ProductsPage() {
  return <ProductsClient />;
}
// ...existing code...
