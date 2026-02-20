using EmployeeBackend.Models;
using EmployeeBackend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static EmployeeBackend.DTOs.AuthDTO;

namespace EmployeeBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly EmployeeContext _db;
        private readonly PasswordHasher<User> _hasher;
        private readonly JWTService _jwt;

        public AuthController(EmployeeContext db, JWTService jwt)
        {
            _db = db;
            _hasher = new PasswordHasher<User>();
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
                return BadRequest("Username already exists.");

            var user = new User
            {
                Username = dto.Username,
                Role = dto.Role ?? "User"
            };

            user.PasswordHash = _hasher.HashPassword(user, dto.Password);
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return Ok(new AuthResultDto(token, user.Username, user.Role));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null) return Unauthorized("Invalid credentials");

            var verificationResult = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (verificationResult == PasswordVerificationResult.Failed) return Unauthorized("Invalid credentials");

            var token = _jwt.GenerateToken(user);
            return Ok(new AuthResultDto(token, user.Username, user.Role));
        }

    }
}

