using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Lemmikloomad.Models;
using Microsoft.IdentityModel.Tokens;

namespace Lemmikloomad.Services
{
    // Genereerib JWT tokeni autentimiseks – token kehtib 7 päeva
    public class TokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config) => _config = config;

        public string GenerateToken(User user)
        {
            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Tokeni sisse lähevad kasutaja ID, meil, nimi ja roll
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email,          user.Email),
                new Claim(ClaimTypes.Name,           user.Name),
                new Claim(ClaimTypes.Role,           user.Role)
            };

            var token = new JwtSecurityToken(
                issuer:            _config["Jwt:Issuer"],
                audience:          _config["Jwt:Audience"],
                claims:            claims,
                expires:           DateTime.UtcNow.AddDays(7),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
