using CineVault.API.Services.TmdbModels;

namespace CineVault.API.Services;

public interface ITmdbService
{
    Task<TmdbSearchResponse?> BuscarFilmesPorNomeAsync(string nomeFilme);
    Task<TmdbModels.TmdbMovie?> BuscarFilmePorIdAsync(int tmdbId);
}   