using CineVault.API.Data;
using CineVault.API.Models;
using CineVault.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CineVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoritosController : ControllerBase
{
    private readonly CineVaultDbContext _context;
    private readonly ITmdbService _tmdbService;

    // Injetamos o TmdbService no construtor
    public FavoritosController(CineVaultDbContext context, ITmdbService tmdbService)
    {
        _context = context;
        _tmdbService = tmdbService;
    }

    [HttpGet("{usuarioId}")]
    public async Task<IActionResult> GetFavoritos(int usuarioId)
    {
        var favoritos = await _context.Favoritos
            .Include(f => f.Filme) // Traz os dados do filme junto com o favorito
            .Where(f => f.UsuarioId == usuarioId)
            .ToListAsync();

        return Ok(favoritos);
    }

    [HttpPost]
    public async Task<IActionResult> PostFavorito(FavoritoRequest request)
    {
        // 1. Procurar o filme na base de dados local através do TMDBId
        var filme = await _context.Filmes.FirstOrDefaultAsync(f => f.TMDBId == request.TmdbId);

        // 2. Se não existir localmente, importa do TMDB
        if (filme == null)
        {
            var tmdbMovie = await _tmdbService.BuscarFilmePorIdAsync(request.TmdbId);
            if (tmdbMovie == null) 
                return NotFound(new { mensagem = "Filme não encontrado no TMDB." });

            filme = new Filme
            {
                Titulo = tmdbMovie.Title,
                Sinopse = tmdbMovie.Overview,
                Ano = !string.IsNullOrEmpty(tmdbMovie.ReleaseDate) && tmdbMovie.ReleaseDate.Length >= 4 
                    ? int.Parse(tmdbMovie.ReleaseDate.Substring(0, 4)) : null,
                PosterUrl = !string.IsNullOrEmpty(tmdbMovie.PosterPath) 
                    ? $"https://image.tmdb.org/t/p/w500{tmdbMovie.PosterPath}" : null,
                TMDBId = tmdbMovie.Id,
                DataCriacao = DateTime.UtcNow
            };
            
            _context.Filmes.Add(filme);
            await _context.SaveChangesAsync(); // Guarda para gerar o ID local
        }

        // 3. Criar o favorito com o ID local
        var favorito = new Favorito
        {
            UsuarioId = request.UsuarioId,
            FilmeId = filme.Id, // Usa o ID interno do SQL Server
            DataCriacao = DateTime.UtcNow
        };

        _context.Favoritos.Add(favorito);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { mensagem = "Este filme já se encontra nos favoritos deste utilizador." });
        }

        return Ok(favorito);
    }
}

public class FavoritoRequest
{
    public int UsuarioId { get; set; }
    public int TmdbId { get; set; } // Alterado de FilmeId para TmdbId
}