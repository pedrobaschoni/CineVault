namespace CineVault.API.Models;

public class Filme
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Sinopse { get; set; }
    public int? Ano { get; set; }
    public string? PosterUrl { get; set; }
    public int? TMDBId { get; set; }
    public DateTime DataCriacao { get; set; }

    public ICollection<Avaliacao> Avaliacoes { get; set; } = new List<Avaliacao>();
    public ICollection<Favorito> Favoritos { get; set; } = new List<Favorito>();
}