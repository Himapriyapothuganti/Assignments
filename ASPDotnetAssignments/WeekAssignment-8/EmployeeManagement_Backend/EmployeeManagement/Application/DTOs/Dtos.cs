using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

// ─── Auth DTOs ───────────────────────────────────────────────────────────────

public class LoginDto
{
    [Required] public string Username { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
    [Required] public string CaptchaToken { get; set; } = string.Empty; // From client-side CAPTCHA
}

public class RegisterDto
{
    [Required] public string Username { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string FullName { get; set; } = string.Empty;
    [Required, MinLength(8)] public string Password { get; set; } = string.Empty;
    [Required] public string Role { get; set; } = "Employee"; // Admin | Manager | Employee
}

public class ForgotPasswordDto
{
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
}

public class ResetPasswordDto
{
    [Required] public string Token { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required, MinLength(8)] public string NewPassword { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

// ─── Employee DTOs ───────────────────────────────────────────────────────────

public class EmployeeDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public DateTime HireDate { get; set; }
    public bool IsActive { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateEmployeeDto
{
    [Required] public string FullName { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string Phone { get; set; } = string.Empty;
    [Required] public string Department { get; set; } = string.Empty;
    [Required] public string Position { get; set; } = string.Empty;
    [Range(0, double.MaxValue)] public decimal Salary { get; set; }
    public DateTime HireDate { get; set; } = DateTime.UtcNow;
    [Required] public string UserId { get; set; } = string.Empty;
}

public class UpdateEmployeeDto
{
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? Department { get; set; }
    public string? Position { get; set; }
    public decimal? Salary { get; set; }
    public bool? IsActive { get; set; }
}

// ─── User Management DTOs ────────────────────────────────────────────────────

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AssignRoleDto
{
    [Required] public string UserId { get; set; } = string.Empty;
    [Required] public string Role { get; set; } = string.Empty;
}

// ─── Common ──────────────────────────────────────────────────────────────────

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Success") =>
        new() { Success = true, Message = message, Data = data };

    public static ApiResponse<T> Fail(string message, List<string>? errors = null) =>
        new() { Success = false, Message = message, Errors = errors };
}
