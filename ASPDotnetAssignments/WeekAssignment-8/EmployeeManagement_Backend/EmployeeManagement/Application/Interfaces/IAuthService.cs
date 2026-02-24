using Application.DTOs;

namespace Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
    Task<bool> ForgotPasswordAsync(ForgotPasswordDto dto);
    Task<bool> ResetPasswordAsync(ResetPasswordDto dto);
    Task<bool> SignOutAsync(string userId);
    Task<UserDto?> GetCurrentUserAsync(string userId);
}
