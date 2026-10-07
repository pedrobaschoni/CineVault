/**
 * DADOS DE EXEMPLO — só até a Fase 2.
 * Servem para montar as telas com a identidade nova antes da integração
 * com o TMDB. Quando o serviço de catálogo existir, este arquivo é apagado.
 */
import type { MediaType } from '@/types';

export interface SampleTitle {
  id: string;
  type: MediaType;
  title: string;
  year: number;
  score: number;
  color: string;
}

export const SAMPLE_TITLES: SampleTitle[] = [
  { id: 'duna-2', type: 'filme', title: 'Duna: Parte Dois', year: 2024, score: 8.9, color: '#4a3622' },
  { id: 'frieren', type: 'anime', title: 'Frieren', year: 2023, score: 9.3, color: '#2c3f45' },
  { id: 'pousando-no-amor', type: 'dorama', title: 'Pousando no Amor', year: 2019, score: 8.7, color: '#4a2a33' },
  { id: 'o-urso', type: 'serie', title: 'O Urso', year: 2022, score: 8.6, color: '#23304d' },
  { id: 'oppenheimer', type: 'filme', title: 'Oppenheimer', year: 2023, score: 8.4, color: '#3d2e1f' },
  { id: 'jujutsu-kaisen', type: 'anime', title: 'Jujutsu Kaisen', year: 2020, score: 8.5, color: '#2b2440' },
];

export const SAMPLE_FEATURED = {
  id: 'xogum',
  type: 'serie' as MediaType,
  title: 'Xógum',
  year: 2024,
  meta: 'Série · 2024 · 1 temporada · 10 episódios · 16+',
  synopsis:
    'No Japão feudal, um navegador inglês naufraga e acaba no centro de uma disputa pelo poder entre senhores rivais.',
  color: '#3b1f1f',
};

export const SAMPLE_CONTINUE = [
  { id: 'arcane', title: 'Arcane', progress: 'T2 · E4 de 9', done: 4, total: 9, color: '#3a2b47' },
  { id: 'frieren', title: 'Frieren', progress: 'T1 · E19 de 28', done: 19, total: 28, color: '#2c3f45' },
  { id: 'pousando-no-amor', title: 'Pousando no Amor', progress: 'T1 · E11 de 16', done: 11, total: 16, color: '#4a2a33' },
  { id: 'o-urso', title: 'O Urso', progress: 'T3 · E2 de 10', done: 2, total: 10, color: '#23304d' },
];

export const SAMPLE_DIARY = [
  { id: 'd1', date: '2026-10-05', title: 'Vidas Passadas', meta: 'Filme · 2023 · primeira vez', rating: 4.5 },
  { id: 'd2', date: '2026-10-02', title: 'Arcane · T2 E3', meta: 'Série · 2024 · episódio', rating: 5 },
  { id: 'd3', date: '2026-09-28', title: 'Interestelar', meta: 'Filme · 2014 · reassistido', rating: 5 },
];

export const SAMPLE_RANKING = [
  { id: 'frieren', title: 'Frieren', type: 'anime' as MediaType, trend: 2 },
  { id: 'arcane', title: 'Arcane', type: 'serie' as MediaType, trend: 0 },
  { id: 'duna-2', title: 'Duna: Parte Dois', type: 'filme' as MediaType, trend: -1 },
  { id: 'pousando-no-amor', title: 'Pousando no Amor', type: 'dorama' as MediaType, trend: 4 },
  { id: 'o-urso', title: 'O Urso', type: 'serie' as MediaType, trend: 0 },
];
