/**
 * Tipos de domínio do CineVault.
 * O catálogo (Title) virá do TMDB na Fase 2; os dados do usuário
 * (Rating, DiaryEntry, UserList) virão dos serviços da Fase 3.
 */

export type MediaType = 'filme' | 'serie' | 'anime' | 'dorama';

export interface Title {
  id: string;
  type: MediaType;
  title: string;
  originalTitle?: string;
  year: number;
  posterUrl?: string;
  backdropUrl?: string;
  /** Nota da comunidade, de 0 a 10. */
  score?: number;
  genres?: string[];
  synopsis?: string;
}

/** Nota do usuário, de 0,5 a 5 em passos de 0,5. */
export type RatingValue = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export interface Rating {
  titleId: string;
  value: RatingValue;
  review?: string;
  hasSpoiler?: boolean;
  createdAt: string;
}

export interface DiaryEntry {
  id: string;
  titleId: string;
  /** Data em que assistiu, no formato AAAA-MM-DD. */
  watchedOn: string;
  rewatch: boolean;
  /** Para séries e animes: episódio assistido, se for o caso. */
  episode?: { season: number; number: number };
  rating?: RatingValue;
}

export interface UserList {
  id: string;
  name: string;
  kind: 'favoritos' | 'quero-ver' | 'personalizada';
  titleIds: string[];
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}
