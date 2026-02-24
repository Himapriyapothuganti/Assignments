using System.Security.Claims;
using Application.DTOs;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    /// <summary>
    /// Login with username/password + CAPTCHA token
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse<string>.Fail("Validation failed",
            ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

        var result = await _authService.LoginAsync(dto);
        if (result == null)
            return Unauthorized(ApiResponse<string>.Fail("Invalid credentials or CAPTCHA failed."));

        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Login successful"));
    }

    /// <summary>
    /// Register a new user — Role assignment restricted to Admin
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous] // In production, restrict Admin/Manager registration to [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse<string>.Fail("Validation failed",
            ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

        // Restrict privileged role assignment
        if ((dto.Role == Roles.Admin || dto.Role == Roles.Manager) &&
            !(User.IsInRole(Roles.Admin)))
        {
            dto.Role = Roles.Employee; // Downgrade silently
        }

        var result = await _authService.RegisterAsync(dto);
        if (result == null)
            return BadRequest(ApiResponse<string>.Fail("Registration failed. Email may already be in use."));

        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Registration successful"));
    }

    /// <summary>
    /// Initiate forgot-password flow (sends reset token via email in production)
    /// </summary>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse<string>.Fail("Validation failed",
            ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

        await _authService.ForgotPasswordAsync(dto);
        // Always return success to prevent email enumeration
        return Ok(ApiResponse<string>.Ok("", "If the email exists, a reset link has been sent."));
    }

    /// <summary>
    /// Reset password with token received from email
    /// </summary>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse<string>.Fail("Validation failed",
            ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

        var result = await _authService.ResetPasswordAsync(dto);
        if (!result) return BadRequest(ApiResponse<string>.Fail("Invalid or expired reset token."));

        return Ok(ApiResponse<string>.Ok("", "Password reset successfully."));
    }

    /// <summary>
    /// Sign out — invalidates refresh token server-side; client should discard JWT
    /// </summary>
    [HttpPost("signout")]
    [Authorize]
    public async Task<IActionResult> SignOut()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        await _authService.SignOutAsync(userId);
        return Ok(ApiResponse<string>.Ok("", "Signed out successfully."));
    }

    /// <summary>
    /// Get currently authenticated user info
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _authService.GetCurrentUserAsync(userId);
        if (user == null) return NotFound(ApiResponse<string>.Fail("User not found"));

        return Ok(ApiResponse<UserDto>.Ok(user));
    }
}
