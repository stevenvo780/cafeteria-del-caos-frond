/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react';
import { Metadata } from 'next';
import axios from '@/utils/axiosServer';
import { Library, Like } from '@/utils/types';
import ClientLibrary from '../ClientLibrary';

interface PageProps {
  params: Promise<any>;
  searchParams: Promise<any>;
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const { id } = await params;
  const baseMetadata = {
    title: 'Biblioteca | Cafetería del Caos',
    description: 'Explora nuestra biblioteca de conocimiento. Encuentra artículos, guías y recursos sobre diversos temas.',
    keywords: 'biblioteca, conocimiento, recursos, artículos, guías',
    openGraph: {
      title: 'Biblioteca | Cafetería del Caos',
      description: 'Explora nuestra biblioteca de conocimiento',
      type: 'website',
      url: `${baseUrl}/library`,
    }
  };

  try {
    const note = await axios.get<Library>(`/library/${id}`);
    const noteData = note?.data;
    if (noteData) {
      return {
        ...baseMetadata,
        title: `${noteData.title} | Biblioteca`,
        description: noteData.description.substring(0, 160),
        openGraph: {
          ...baseMetadata.openGraph,
          title: `${noteData.title} | Biblioteca`,
          description: noteData.description.substring(0, 160),
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/library/${id}`,
          images: noteData.imageUrl ? [
            {
              url: noteData.imageUrl,
              width: 1200,
              height: 630,
              alt: noteData.title,
            }
          ] : []
        }
      };
    }
  } catch (error) {
    console.error('Error fetching note metadata:', error);
  }

  return baseMetadata;
}

async function getInitialData(noteId?: string) {
  try {
    if (noteId) {
      const [noteResponse, likesResponse, userLikeResponse] = await Promise.all([
        axios.get<Library>(`/library/${noteId}`),
        axios.get(`/likes/library/${noteId}/count`),
        axios.get<Like>(`/likes/library/${noteId}/user-like`)
      ]);

      return {
        initialNote: noteResponse.data,
        libraries: [],
        totalItems: 0,
        likesData: {
          [noteId]: {
            likes: likesResponse.data.likes,
            dislikes: likesResponse.data.dislikes,
            userLike: userLikeResponse.data || null
          }
        }
      };
    } else {
      const librariesResponse = await axios.get('/library', {
        params: { page: 1, limit: 50 }
      });

      const libraries: Library[] = librariesResponse.data.data || [];
      const likesPromises = libraries.map(async (lib) => {
        const [likesCount, userLike] = await Promise.all([
          axios.get(`/likes/library/${lib.id}/count`),
          axios.get<Like>(`/likes/library/${lib.id}/user-like`)
        ]);
        return {
          id: lib.id,
          likes: likesCount.data.likes,
          dislikes: likesCount.data.dislikes,
          userLike: userLike.data || null
        };
      });

      const likesResults = await Promise.all(likesPromises);
      const likesData = likesResults.reduce((acc: Record<string, { 
        likes: number; 
        dislikes: number; 
        userLike: Like | null 
      }>, curr) => {
        acc[curr.id] = {
          likes: curr.likes,
          dislikes: curr.dislikes,
          userLike: curr.userLike
        };
        return acc;
      }, {});

      return {
        initialNote: null,
        libraries,
        totalItems: librariesResponse.data.total,
        likesData
      };
    }
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      initialNote: null,
      libraries: [],
      totalItems: 0,
      likesData: {}
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const initialData = await getInitialData(id);

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ClientLibrary initialData={initialData} />
    </Suspense>
  );
}
