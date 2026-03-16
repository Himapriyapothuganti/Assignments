namespace Authentication.Application.DTOs
{
    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }
        public string? UserId { get; set; }
        public string? Role { get; set; }
        public string? FullName { get; set; }
    }
}
