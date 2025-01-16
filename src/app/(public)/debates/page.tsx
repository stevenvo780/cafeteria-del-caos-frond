import { Metadata } from 'next';
import React from 'react';
import DebatesClient from './DebatesClient';

export const metadata: Metadata = {
  title: 'Orquestador de charlas',
  description: 'Orquestador de debates de la Cafetería del Caos',
  openGraph: {
    title: 'Orquestador de charlas - Cafetería del Caos',
    description: 'Participa en nuestros debates y discusiones',
  }
};

export default function DebatesPage() {
  return <DebatesClient />;
}
