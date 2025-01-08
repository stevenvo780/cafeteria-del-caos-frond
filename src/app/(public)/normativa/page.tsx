import { Metadata } from 'next';
import React from 'react';
import NormativaClient from './NormativaClient';

export const metadata: Metadata = {
  title: 'Normativa General',
  description: 'Normativa general y reglas de la Cafetería del Caos',
  openGraph: {
    title: 'Normativa General - Cafetería del Caos',
    description: 'Conoce nuestras normas y regulaciones para mantener un espacio de debate saludable',
    images: [],
  }
};

export default function NormativaPage() {
  return <NormativaClient />;
}
