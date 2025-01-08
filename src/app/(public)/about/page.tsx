import { Metadata } from 'next';
import React from 'react';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Información sobre la Cafetería del Caos',
  openGraph: {
    title: 'Sobre Nosotros - Cafetería del Caos',
    description: 'Conoce más sobre nuestra comunidad y proyecto',
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
