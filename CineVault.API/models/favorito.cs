namespace CineVault.API.Models;

public class Favorito
{
    public int UsuarioId { get; set; }
    public int FilmeId { get; set; }
    public DateTime DataCriacao { get; set; }

    public Usuario Usuario { get; set; } = null!;
    public Filme Filme { get; set; } = null!;
}