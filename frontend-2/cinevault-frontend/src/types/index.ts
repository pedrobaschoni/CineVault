// Este arquivo contém definições de tipos e interfaces que serão utilizadas em todo o projeto.

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    releaseDate: string;
    rating: number;
    description: string;
}

export interface Review {
    id: string;
    userId: string;
    movieId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}