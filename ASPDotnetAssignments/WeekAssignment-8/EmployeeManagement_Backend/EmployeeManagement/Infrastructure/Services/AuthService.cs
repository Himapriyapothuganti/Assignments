using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtService jwtService,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _logger = logger;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        // NOTE: CAPTCHA token should be verified against Google reCAPTCHA
        // or your CAPTCHA provider here before proceeding.
        // Example: await VerifyCaptchaAsync(dto.CaptchaToken);

        var user = await _userManager.FindByNameAsync(dto.Username)
                ?? await _userManager.FindByEmailAsync(dto.Username);

        if (user == null || !user.IsActive)
        {
            _logger.LogWarning("Login attempt for unknown/inactive user: {Username}", dto.Username);
            return null;
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            _logger.LogWarning("Failed login for user: {Username}", dto.Username);
            return null;
        }

        return await BuildAuthResponseAsync(user);
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
    {
        if (await _userManager.FindByEmailAsync(dto.Email) != null)
            return null; // Email already exists

        var user = new ApplicationUser
        {
            UserName = dto.Username,
            Email = dto.Email,
            FullName = dto.FullName,
            EmailConfirmed = true, // Auto-confirm; add email verification in production
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            _logger.LogError("Registration failed: {Errors}",
                string.Join(", ", result.Errors.Select(e => e.Description)));
            return null;
        }

        // Assign role — only Admin can assign Admin/Manager roles (enforce in controller)
        var role = dto.Role is "Admin" or "Manager" or "Employee" ? dto.Role : "Employee";
        await _userManager.AddToRoleAsync(user, role);

        _logger.LogInformation("New user registered: {Username} ({Role})", dto.Username, role);
        return await BuildAuthResponseAsync(user);
    }

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return true; // Don't reveal user existence

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        // In production: send email with reset link containing token
        // For now: log the token (remove in production!)
        _logger.LogInformation("Password reset token for {Email}: {Token}", dto.Email, token);

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return false;

        var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
        return result.Succeeded;
    }

    public async Task<bool> SignOutAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        // Invalidate refresh token
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        await _userManager.UpdateAsync(user);

        // JWT is stateless — client removes token on its side.
        // For server-side invalidation, maintain a token blacklist (Redis) in production.
        return true;
    }

    public async Task<UserDto?> GetCurrentUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);
        return new UserDto
        {
            Id = user.Id,
            Username = user.UserName ?? "",
            Email = user.Email ?? "",
            FullName = user.FullName,
            Role = roles.FirstOrDefault() ?? "",
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private async Task<AuthResponseDto> BuildAuthResponseAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Employee";

        var token = _jwtService.GenerateToken(user, role);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            Expiration = DateTime.UtcNow.AddHours(1),
            UserId = user.Id,
            Username = user.UserName ?? "",
            FullName = user.FullName,
            Email = user.Email ?? "",
            Role = role
        };
    }
}
