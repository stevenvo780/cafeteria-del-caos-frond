import { Metadata } from 'next';
import React from 'react';
import PrivacyPoliciesClient from './PrivacyPoliciesClient';

export const metadata: Metadata = {
  title: 'Políticas de Privacidad',
  description: 'Políticas de privacidad de la Cafetería del Caos',
  openGraph: {
    title: 'Políticas de Privacidad - Cafetería del Caos',
    description: 'Conoce nuestras políticas sobre el manejo de datos y privacidad',
    images: [],
  },
  keywords: ['privacidad', 'políticas', 'datos personales', 'Cafetería del Caos'],
  alternates: {
    canonical: 'https://cafeteriadelcaos.com/privacy-policies',
  }
};

export default function PrivacyPoliciesPage() {
  return <PrivacyPoliciesClient />;
}
