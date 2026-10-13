export class TmdbError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'TmdbError';
  }
}

export function isNotFound(error: unknown): boolean {
  return error instanceof TmdbError && error.status === 404;
}
