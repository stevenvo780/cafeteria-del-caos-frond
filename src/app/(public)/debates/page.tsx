import { Metadata } from 'next';
import React from 'react';
import DebatesClient from './DebatesClient';

export const metadata: Metadata = {
  title: 'Debates',
  description: 'Espacio de debates de la Cafetería del Caos',
  openGraph: {
    title: 'Debates - Cafetería del Caos',
    description: 'Participa en nuestros debates y discusiones',
  }
};

export default function DebatesPage() {
  return <DebatesClient />;
}
