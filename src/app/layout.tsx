import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Providers } from './providers';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';
import './styles.css';
import Head from 'next/head';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafeteriadelcaos.com';

export const metadata = {
  title: {
    default: 'Cafetería del Caos',
    template: '%s | Cafetería del Caos'
  },
  description: 'Comunidad de debate y pensamiento libre donde las ideas más radicales encuentran su espacio. Debates filosóficos, políticos y sociales sin censura.',
  keywords: [
    'debates',
    'pensamiento libre',
    'filosofía',
    'política',
    'teoría crítica',
    'sociedad',
    'cultura',
    'educación',
    'ciencia',
    'tecnología'
  ],
  authors: [
    { name: 'Cafetería del Caos', email: 'cafeteriadelcaos@gmail.com' },
    { name: 'Stev', email: 'stevenvallejo780@gmail.com' }
  ],
  creator: 'Cafetería del Caos',
  publisher: 'Cafetería del Caos',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Cafetería del Caos',
    description: 'Comunidad de debate y pensamiento libre donde las ideas más radicales encuentran su espacio.',
    url: siteUrl,
    siteName: 'Cafetería del Caos',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cafetería del Caos',
    description: 'Comunidad de debate y pensamiento libre donde las ideas más radicales encuentran su espacio.',
    creator: '@CafeteriaDelCaos',
    images: [{
      url: '/images/logo.png',
      alt: 'Logo de Cafetería del Caos',
    }],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/favicon.ico',
    apple: '/images/apple-touch-icon.png',
    shortcut: '/images/logo.png',
  },
};

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cafetería del Caos',
  url: siteUrl,
  logo: '/images/logo.png',
  description: 'Espacio para debates sin filtros, ideas radicales y pensamiento libre.',
  sameAs: [
    'https://www.facebook.com/share/18ZfbANxtt/?mibextid=qi2Omg',
    'https://www.tiktok.com/@cafeteriadelcaos?_t=ZM-8ss70SvHI2v&_r=1',
    'https://youtube.com/@cafeteriadelcaos?si=mcShGmbDcyEg2tUq',
    'https://x.com/CafeteriaCaos?t=yI2qsHEdFY7cKRA4zZDEjQ&s=09'
  ],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <body suppressHydrationWarning={true}>
        <Providers>
          <ClientLayout>
            <div style={{ marginTop: '1rem' }}>
              {children}
            </div>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
