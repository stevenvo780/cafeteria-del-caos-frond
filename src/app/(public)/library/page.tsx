/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import axios from '@/utils/axiosServer';
import ClientLibrary from './ClientLibrary';
import { Library, Like } from '@/utils/types';

export const metadata: Metadata = {
  title: 'Biblioteca',
  description: 'Biblioteca de la Cafetería del Caos',
  openGraph: {
    title: 'Biblioteca - Cafetería del Caos',
    description: 'Explora la biblioteca de la Cafetería del Caos',
    images: [],
  },
  twitter: {
    images: [],
  },
  keywords: ['biblioteca', 'libros', 'Cafetería del Caos'],
  alternates: {
    canonical: 'https://cafeteriadelcaos.com/library',
  }
};

async function getLibraryList() {
  try {
    const librariesResponse = await axios.get('/library', {
      params: { page: 1, limit: 50 }
    });

    const likesPromises = librariesResponse.data.data.map(async (library: Library) => {
      const [likesCount, userLike] = await Promise.all([
        axios.get(`/likes/library/${library.id}/count`),
        axios.get(`/likes/library/${library.id}/user-like`)
      ]);
      return {
        id: library.id,
        likes: likesCount.data.likes,
        dislikes: likesCount.data.dislikes,
        userLike: userLike.data || null
      };
    });

    const likesResults = await Promise.all(likesPromises);
    const likesData = likesResults.reduce((acc: Record<number, { likes: number; dislikes: number; userLike: Like | null }>, curr) => {
      acc[curr.id] = {
        likes: curr.likes,
        dislikes: curr.dislikes,
        userLike: curr.userLike
      };
      return acc;
    }, {});

    return {
      initialNote: null,
      libraries: librariesResponse.data.data,
      totalItems: librariesResponse.data.total,
      likesData
    };
  } catch (error) {
    console.error('Error fetching library list:', error);
    return {
      initialNote: null,
      libraries: [],
      totalItems: 0,
      likesData: {}
    };
  }
}

export default async function Page() {
  const libraryList = await getLibraryList();
  return <ClientLibrary initialData={libraryList} />;
}
