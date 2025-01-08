import { Metadata } from 'next';
import React from 'react';
import EventsClient from './EventsClient';

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Calendario de eventos y debates de la Cafetería del Caos',
  openGraph: {
    title: 'Eventos - Cafetería del Caos',
    description: 'Participa en nuestros eventos semanales como debates incendiarios o lecturas mentalmente estimulantes y mucho mas!',
    type: 'website',
  },
  keywords: [
    'eventos',
    'debates',
    'Cafetería del Caos',
    'lecturas semanales',
    'encuentros',
    'charlas',
    'conferencias',
    'panel',
  ],
  alternates: {
    canonical: 'https://cafeteriadelcaos.com/events',
  }
};

export default function EventsPage() {
  return <EventsClient />;
}
