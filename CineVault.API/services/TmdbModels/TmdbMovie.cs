using System.Text.Json.Serialization;

namespace CineVault.API.Services.TmdbModels;

public class TmdbMovie
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("overview")]
    public string Overview { get; set; } = string.Empty;

    [JsonPropertyName("release_date")]
    public string ReleaseDate { get; set; } = string.Empty;

    [JsonPropertyName("poster_path")]
    public string PosterPath { get; set; } = string.Empty;
}

public class TmdbSearchResponse
{
    [JsonPropertyName("results")]
    public List<TmdbMovie> Results { get; set; } = new List<TmdbMovie>();
}   