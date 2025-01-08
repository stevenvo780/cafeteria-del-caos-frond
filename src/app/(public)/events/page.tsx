
import { Metadata } from 'next';
import React from 'react';
import EventsClient from './EventsClient';

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Calendario de eventos y debates de la Cafetería del Caos',
  openGraph: {
    title: 'Eventos - Cafetería del Caos',
    description: 'Participa en nuestros eventos semanales de debates incendiarios y lecturas mentalmente estimulantes',
    type: 'website',
  }
};

export default function EventsPage() {
  return <EventsClient />;
}
