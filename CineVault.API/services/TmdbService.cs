using CineVault.API.Services.TmdbModels;
using System.Text.Json;

namespace CineVault.API.Services;

public class TmdbService : ITmdbService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public TmdbService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(configuration["TMDB:BaseUrl"]!);
        _apiKey = configuration["TMDB:ApiKey"]!;
    }

    public async Task<TmdbMovie?> BuscarFilmePorIdAsync(int tmdbId)
    {
        var endpoint = $"movie/{tmdbId}?api_key={_apiKey}&language=pt-PT";
        
        var response = await _httpClient.GetAsync(endpoint);
        
        if (!response.IsSuccessStatusCode)
            return null; // Retorna nulo se o filme não existir no TMDB

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<TmdbMovie>(json);
    }

    public async Task<TmdbSearchResponse?> BuscarFilmesPorNomeAsync(string nomeFilme)
    {
        // Endpoint do TMDB para pesquisar filmes, incluindo a chave e o idioma PT-BR ou PT-PT
        var endpoint = $"search/movie?api_key={_apiKey}&query={Uri.EscapeDataString(nomeFilme)}&language=pt-PT";
        
        var response = await _httpClient.GetAsync(endpoint);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<TmdbSearchResponse>(json);
    }
}