import { Metadata } from 'next';
import axios from '@/utils/axiosServer';
import ClientHome from './(public)/home/ClientHome';

export const metadata: Metadata = {
  title: 'Cafetería del Caos | Debate, Filosofía y Pensamiento Libre',
  description: 'Explora el epicentro del caos intelectual. Un espacio para debates filosóficos, políticos y sociales, ideas radicales y pensamiento libre.',
  keywords: [
    'debates',
    'filosofía',
    'pensamiento libre',
    'política',
    'teoría crítica',
    'ciencia',
    'sociedad',
    'cultura',
    'educación',
    'comunidad de debates',
    'eventos intelectuales'
  ],
  openGraph: {
    title: 'Cafetería del Caos | Espacio de Debates y Pensamiento Libre',
    description: 'Un espacio donde las ideas radicales encuentran su hogar y los debates filosóficos, políticos y sociales florecen sin restricciones.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cafeteriadelcaos.com',
    siteName: 'Cafetería del Caos',
    locale: 'es_ES',
    images: [
      {
        url: '/images/camaron_margen.png',
        width: 1200,
        height: 630,
        alt: 'Logo de Cafetería del Caos',
      },
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cafetería del Caos | Debate y Filosofía',
    description: 'Un lugar para pensamiento libre, debates radicales y discusiones intensas.',
    creator: '@CafeteriaDelCaos',
    images: ['/images/hero-image.jpg']
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://cafeteriadelcaos.com',
    languages: {
      'es-ES': process.env.NEXT_PUBLIC_SITE_URL || 'https://cafeteriadelcaos.com'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  icons: {
    icon: '/images/favicon.ico',
    apple: '/images/apple-touch-icon.png',
  }
};

// -- SSR data fetching with fallback to avoid missing data
async function getInitialData() {
  try {
    const [publicationsRes, eventsRes, notesRes, guildMembersRes] = await Promise.all([
      axios.get('/publications', { params: { limit: 4, offset: 0 } }),
      axios.get('/events/home/upcoming?limit=31'),
      axios.get('/library/home/latest?limit=3'),
      axios.get('/discord/guild/members')
    ]);

    return {
      initialPublications: publicationsRes.data || [],
      events: {
        repetitive: eventsRes.data?.filter((event) => event.repetition) || [],
        unique: eventsRes.data
          ? eventsRes.data.filter((event) => !event.repetition).slice(0, 3)
          : []
      },
      latestNotes: notesRes.data || [],
      guildMemberCount: guildMembersRes.data || null
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      initialPublications: [],
      events: { repetitive: [], unique: [] },
      latestNotes: [],
      guildMemberCount: null
    };
  }
}

export default async function HomePage() {
  const initialData = await getInitialData();
  return <ClientHome initialData={initialData} />;
}
