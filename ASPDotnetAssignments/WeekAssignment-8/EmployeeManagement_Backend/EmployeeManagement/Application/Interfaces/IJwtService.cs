using Domain.Entities;

namespace Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(ApplicationUser user, string role);
    string GenerateRefreshToken();
    System.Security.Claims.ClaimsPrincipal? ValidateToken(string token);
}
