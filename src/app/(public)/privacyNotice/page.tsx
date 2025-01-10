import { Metadata } from 'next';
import React from 'react';
import PrivacyNoticeClient from './PrivacyNoticeClient';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad',
  description: 'Aviso de privacidad de la Cafetería del Caos',
  openGraph: {
    title: 'Aviso de Privacidad - Cafetería del Caos',
    description: 'Información sobre cómo manejamos tus datos personales',
    images: [],
  },
  twitter: {
    images: [],
  },
  keywords: ['privacidad', 'datos personales', 'aviso legal', 'Cafetería del Caos'],
  alternates: {
    canonical: 'https://cafeteriadelcaos.com/privacy-notice',
  }
};

export default function PrivacyNoticePage() {
  return <PrivacyNoticeClient />;
}
