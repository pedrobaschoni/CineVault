
using CineVault.API.Data;
using Microsoft.AspNetCore.Mvc;

namespace CineVault.API.Controllers;

[ApiController]
[Route("api/banco")]
public class BancoController : ControllerBase
{
    private readonly CineVaultDbContext _context;

    public BancoController(CineVaultDbContext context)
    {
        _context = context;
    }

    [HttpGet("teste")]
    public async Task<IActionResult> TestarConexao()
    {
        try
        {
            bool conectado = await _context.Database.CanConnectAsync();

            if (conectado)
            {
                return Ok(new
                {
                    mensagem = "Conexão com o banco realizada com sucesso!"
                });
            }

            return StatusCode(503, new
            {
                mensagem = "Não foi possível conectar ao banco de dados."
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                mensagem = "Erro ao conectar ao banco de dados.",
                erro = ex.Message
            });
        }
    }
}
