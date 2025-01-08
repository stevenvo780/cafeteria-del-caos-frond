import { Metadata } from 'next';
import React from 'react';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Registro',
  description: 'Únete a la comunidad de debate más caótica',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Registro - Cafetería del Caos',
    description: 'Crea tu cuenta y forma parte de los debates más intensos',
  }
};

export default function RegisterPage() {
  return <RegisterClient />;
}
