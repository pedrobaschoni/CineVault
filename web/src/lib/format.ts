const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** Nota no padrão brasileiro: 4.5 → "4,5". */
export function formatRating(value: number, digits = 1): string {
  return value.toFixed(digits).replace('.', ',');
}

/** "2026-10-05" → { dia: "05", mes: "out" }. Lê a string para não sofrer com fuso horário. */
export function splitDate(iso: string): { dia: string; mes: string } {
  const [, m, d] = iso.split('-');
  return { dia: d.padStart(2, '0'), mes: MESES[Number(m) - 1] ?? '' };
}

/** Rótulos de tipo de mídia. */
export const MEDIA_LABEL = {
  filme: 'Filme',
  serie: 'Série',
  anime: 'Anime',
  dorama: 'Dorama',
} as const;
