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
public class AvaliacoesController : ControllerBase
{
    private readonly CineVaultDbContext _context;
    private readonly ITmdbService _tmdbService;

    public AvaliacoesController(CineVaultDbContext context, ITmdbService tmdbService)
    {
        _context = context;
        _tmdbService = tmdbService;
    }

    [HttpGet("filme/{tmdbId}")] // Agora pesquisa pelo TMDBId
    public async Task<IActionResult> GetAvaliacoesPorFilme(int tmdbId)
    {
        var avaliacoes = await _context.Avaliacoes
            .Include(a => a.Usuario) // Traz os dados do utilizador que avaliou
            .Where(a => a.Filme.TMDBId == tmdbId)
            .ToListAsync();

        return Ok(avaliacoes);
    }

    [HttpPost]
    public async Task<IActionResult> PostAvaliacao(AvaliacaoRequest request)
    {
        var filme = await _context.Filmes.FirstOrDefaultAsync(f => f.TMDBId == request.TmdbId);

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
            await _context.SaveChangesAsync();
        }

        var avaliacao = new Avaliacao
        {
            UsuarioId = request.UsuarioId,
            FilmeId = filme.Id,
            Nota = request.Nota,
            Resenha = request.Resenha,
            DataCriacao = DateTime.UtcNow
        };

        _context.Avaliacoes.Add(avaliacao);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { mensagem = "O utilizador já avaliou este filme." });
        }

        return Ok(avaliacao);
    }
}

public class AvaliacaoRequest
{
    public int UsuarioId { get; set; }
    public int TmdbId { get; set; } // Alterado de FilmeId para TmdbId
    public decimal Nota { get; set; }
    public string? Resenha { get; set; }
}