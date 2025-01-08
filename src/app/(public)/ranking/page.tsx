import { Metadata } from 'next';
import React from 'react';
import RankingClient from './RankingClient';

export const metadata: Metadata = {
  title: 'Ranking y Recompensas',
  description: 'Sistema de clasificación y recompensas de la comunidad',
  openGraph: {
    title: 'Ranking y Recompensas - Cafetería del Caos',
    description: 'Descubre nuestro sistema de recompensas y ranking. Gana puntos, obtén reconocimientos y asciende en la comunidad.',
    type: 'website',
  },
  keywords: ['ranking', 'recompensas', 'puntos', 'Cafetería del Caos'],
  alternates: {
    canonical: 'https://cafeteriadelcaos.com/ranking',
  }
};

export default function RankingPage() {
  return <RankingClient />;
}