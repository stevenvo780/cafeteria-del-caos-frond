import { Metadata } from 'next';
import React from 'react';
import NormativaStaffClient from './NormativaStaffClient';

export const metadata: Metadata = {
  title: 'Normativa del Staff',
  description: 'Normativa y reglas internas para el equipo de moderación y administración',
  openGraph: {
    title: 'Normativa del Staff - Cafetería del Caos',
    description: 'Guías y normativas para el equipo de moderación de la Cafetería del Caos',
  }
};

export default function NormativaStaffPage() {
  return <NormativaStaffClient />;
}
