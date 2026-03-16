using Authentication.Application.DTOs;
using Authentication.Application.Interfaces;
using Authentication.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Authentication.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, 
                           IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterUserDto dto)
        {
            // Check if user already exists
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                return new AuthResponseDto 
                { 
                    Success = false, 
                    Message = "User already exists with this email." 
                };

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // Create user entity
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = passwordHash,
                Role = dto.Role,
                TimeZone = dto.TimeZone,
                TeamId = dto.TeamId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "User registered successfully.",
                UserId = user.Id,
                Role = user.Role,
                FullName = user.FullName
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginUserDto dto)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
                return new AuthResponseDto 
                { 
                    Success = false, 
                    Message = "Invalid email or password." 
                };

            // Verify password
            bool isPasswordValid = BCrypt.Net.BCrypt
                                   .Verify(dto.Password, user.PasswordHash);
            if (!isPasswordValid)
                return new AuthResponseDto 
                { 
                    Success = false, 
                    Message = "Invalid email or password." 
                };

            // Generate JWT token
            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful.",
                Token = token,
                UserId = user.Id,
                Role = user.Role,
                FullName = user.FullName
            };
        }

        private string GenerateJwtToken(User user)
        {
            var secret = _configuration["Jwt:Secret"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret!));
            var credentials = new SigningCredentials(key, 
                              SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("FullName", user.FullName),
                new Claim("TimeZone", user.TimeZone)
            };

            var token = new JwtSecurityToken(
                issuer: "RemoteTeamCollaboration",
                audience: "RemoteTeamCollaboration",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
