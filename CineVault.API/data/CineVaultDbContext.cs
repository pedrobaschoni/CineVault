using CineVault.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CineVault.API.Data;

public class CineVaultDbContext : DbContext
{
    public CineVaultDbContext(DbContextOptions<CineVaultDbContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Filme> Filmes { get; set; }
    public DbSet<Avaliacao> Avaliacoes { get; set; }
    public DbSet<Favorito> Favoritos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Usuario
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Filme
        modelBuilder.Entity<Filme>()
            .HasIndex(f => f.TMDBId)
            .IsUnique();

        // Avaliacao
        modelBuilder.Entity<Avaliacao>()
            .Property(a => a.Nota)
            .HasColumnType("DECIMAL(3,1)");

        modelBuilder.Entity<Avaliacao>()
            .HasIndex(a => new { a.UsuarioId, a.FilmeId })
            .IsUnique();

        // Favorito (Chave Primária Composta)
        modelBuilder.Entity<Favorito>()
            .HasKey(f => new { f.UsuarioId, f.FilmeId });
    }
}