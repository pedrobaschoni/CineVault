namespace CineVault.API.Models;

public class Avaliacao
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public int FilmeId { get; set; }
    public decimal Nota { get; set; }
    public string? Resenha { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime? DataAtualizacao { get; set; }

    public Usuario Usuario { get; set; } = null!;
    public Filme Filme { get; set; } = null!;
}