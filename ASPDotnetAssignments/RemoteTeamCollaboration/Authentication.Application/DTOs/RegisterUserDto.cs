namespace Authentication.Application.DTOs
{
    public class RegisterUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Member";
        public string TimeZone { get; set; } = "UTC";
        public string? TeamId { get; set; }
    }
}
