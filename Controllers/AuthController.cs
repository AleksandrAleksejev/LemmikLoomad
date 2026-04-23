using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Lemmikloomad.Data;
using Lemmikloomad.Models;
using Lemmikloomad.Models.DTO;
using Lemmikloomad.Services;

namespace Lemmikloomad.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;
    private readonly EmailService _emailService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AppDbContext context, TokenService tokenService,
        EmailService emailService, ILogger<AuthController> logger)
    {
        _context      = context;
        _tokenService = tokenService;
        _emailService = emailService;
        _logger       = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "E-mail ja parool on kohustuslikud." });

        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "See e-mail on juba kasutusel." });

        var user = new User
        {
            Email        = dto.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Name         = dto.Name.Trim(),
            Phone        = dto.Phone.Trim(),
            Role         = "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);
        return Ok(new { token, user = new { user.Id, user.Email, user.Name, user.Phone, user.Role } });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email.Trim().ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Vale e-mail või parool." });

        var token = _tokenService.GenerateToken(user);
        return Ok(new { token, user = new { user.Id, user.Email, user.Name, user.Phone, user.Role } });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user   = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();
        return Ok(new { user.Id, user.Email, user.Name, user.Phone, user.Role });
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id, u.Email, u.Name, u.Phone, u.Role, u.CreatedAt,
                PetCount     = u.Lemmikloomad.Count,
                BookingCount = u.Broneeringud.Count
            })
            .ToListAsync();
        return Ok(users);
    }

    // Parooli lähtestamise taotlus – saadame meili ainult siis, kui konto eksisteerib.
    // Vastus on alati sama, et vältida kasutajate loetlemist (email enumeration).
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        const string vastus = "Kui see e-mail on registreeritud, saadetakse lähtestamislink.";

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email.Trim().ToLower());

        if (user == null) return Ok(new { message = vastus });

        user.ResetToken       = Guid.NewGuid().ToString("N");
        user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);
        await _context.SaveChangesAsync();

        var link = $"{Request.Scheme}://{Request.Host}/auth.html?action=reset&token={user.ResetToken}";

        try { await _emailService.SendPasswordResetEmailAsync(user.Email, user.Name, link); }
        catch (Exception ex) { _logger.LogWarning("Parooli lähtestamise meil ebaõnnestus: {Msg}", ex.Message); }

        return Ok(new { message = vastus });
    }

    // Uue parooli seadmine lähtestamislingi kaudu
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        if (string.IsNullOrEmpty(dto.Token) || string.IsNullOrEmpty(dto.NewPassword))
            return BadRequest(new { message = "Token ja uus parool on kohustuslikud." });

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.ResetToken == dto.Token &&
                                      u.ResetTokenExpiry > DateTime.UtcNow);

        if (user == null)
            return BadRequest(new { message = "Link on aegunud või vale. Palun taotlege uus." });

        user.PasswordHash     = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.ResetToken       = null;
        user.ResetTokenExpiry = null;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Parool edukalt muudetud! Logige sisse." });
    }
}

public class ForgotPasswordDto { public string Email { get; set; } = string.Empty; }

public class ResetPasswordDto
{
    public string Token       { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
