using CineVault.API.Data;
using CineVault.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CineVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly CineVaultDbContext _context;
    private readonly IConfiguration _configuration;

    public UsuariosController(CineVaultDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsuarios()
    {
        // Retorna todos os utilizadores (mas não devolve a senha hash por segurança)
        var usuarios = await _context.Usuarios
            .Select(u => new { u.Id, u.Nome, u.Email, u.DataCriacao })
            .ToListAsync();
        return Ok(usuarios);
    }

    [HttpPost("registar")]
    public async Task<IActionResult> Registar(Usuario usuario)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == usuario.Email))
            return BadRequest(new { mensagem = "Este email já está em uso." });

        usuario.Avaliacoes = new List<Avaliacao>();
        usuario.Favoritos = new List<Favorito>();
        usuario.DataCriacao = DateTime.UtcNow;

        // Encriptar a palavra-passe antes de guardar na base de dados
        usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUsuarios), new { id = usuario.Id }, new { usuario.Id, usuario.Nome, usuario.Email });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

        // Verifica se o utilizador existe e se a palavra-passe coincide com o Hash guardado
        if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.SenhaHash))
            return Unauthorized(new { mensagem = "Email ou palavra-passe inválidos." });

        var token = GerarJwtToken(usuario);

        return Ok(new { token, usuario = new { usuario.Id, usuario.Nome, usuario.Email } });
    }

    private string GerarJwtToken(Usuario usuario)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.Nome)
            }),
            Expires = DateTime.UtcNow.AddHours(8), // O token expira em 8 horas
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}