using CineVault.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CineVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TmdbController : ControllerBase
{
    private readonly ITmdbService _tmdbService;

    public TmdbController(ITmdbService tmdbService)
    {
        _tmdbService = tmdbService;
    }

    [HttpGet("pesquisar/{nome}")]
    public async Task<IActionResult> PesquisarFilme(string nome)
    {
        var resultado = await _tmdbService.BuscarFilmesPorNomeAsync(nome);
        
        if (resultado == null || !resultado.Results.Any())
            return NotFound(new { mensagem = "Nenhum filme encontrado." });

        return Ok(resultado.Results);
    }
}