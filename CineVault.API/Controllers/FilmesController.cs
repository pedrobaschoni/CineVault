using CineVault.API.Data;
using CineVault.API.Models;
using CineVault.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CineVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilmesController : ControllerBase
{
    private readonly CineVaultDbContext _context;
    private readonly ITmdbService _tmdbService;

    public FilmesController(CineVaultDbContext context, ITmdbService tmdbService)
    {
        _context = context;
        _tmdbService = tmdbService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFilmes()
    {
        var filmes = await _context.Filmes.ToListAsync();
        return Ok(filmes);
    }

    [HttpPost("importar/{tmdbId}")]
    public async Task<IActionResult> ImportarFilmeDoTmdb(int tmdbId)
    {
        // 1. Verifica se o filme já existe na base de dados local
        var filmeExistente = await _context.Filmes.FirstOrDefaultAsync(f => f.TMDBId == tmdbId);
        if (filmeExistente != null)
        {
            return Ok(new { mensagem = "O filme já existe na base de dados.", filme = filmeExistente });
        }

        // 2. Se não existir, vai buscar os detalhes ao TMDB
        var tmdbMovie = await _tmdbService.BuscarFilmePorIdAsync(tmdbId);
        if (tmdbMovie == null)
        {
            return NotFound(new { mensagem = "Filme não encontrado no TMDB." });
        }

        // 3. Converte o modelo do TMDB para o seu modelo local (Filme)
        var novoFilme = new Filme
        {
            Titulo = tmdbMovie.Title,
            Sinopse = tmdbMovie.Overview,
            // O TMDB devolve a data como "YYYY-MM-DD". Vamos extrair apenas o ano se a data existir.
            Ano = !string.IsNullOrEmpty(tmdbMovie.ReleaseDate) && tmdbMovie.ReleaseDate.Length >= 4 
                ? int.Parse(tmdbMovie.ReleaseDate.Substring(0, 4)) 
                : null,
            PosterUrl = !string.IsNullOrEmpty(tmdbMovie.PosterPath) 
                ? $"https://image.tmdb.org/t/p/w500{tmdbMovie.PosterPath}" 
                : null,
            TMDBId = tmdbMovie.Id,
            DataCriacao = DateTime.UtcNow
        };

        // 4. Guarda o novo filme na base de dados local
        _context.Filmes.Add(novoFilme);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFilmes), new { id = novoFilme.Id }, novoFilme);
    }
}