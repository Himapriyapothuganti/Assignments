using EmployeeBackend.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EmployeeBackend.Services
{
    public class JWTService
    {
        private readonly IConfiguration _config;
        private readonly string _key;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expiresMinutes;

        public JWTService(IConfiguration config)
        {
            _config = config;
            _key = _config["Jwt:Key"]!;
            _issuer = _config["Jwt:Issuer"]!;
            _audience = _config["Jwt:Audience"]!;
            _expiresMinutes = int.Parse(_config["Jwt:ExpiresMinutes"] ?? "60");
        }

        public string GenerateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_expiresMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }


}
