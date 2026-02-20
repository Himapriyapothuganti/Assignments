namespace EmployeeBackend.DTOs
{
    public class AuthDTO
    {
        public record RegisterDto(string Username, string Password, string Role);
        public record LoginDto(string Username, string Password);
        public record AuthResultDto(string Token, string Username, string Role);
    }
}
