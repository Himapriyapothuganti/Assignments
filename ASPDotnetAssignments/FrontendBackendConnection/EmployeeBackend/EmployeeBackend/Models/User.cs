using System.ComponentModel.DataAnnotations;

namespace EmployeeBackend.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required] public string Username { get; set; } = null!;
        [Required] public string PasswordHash { get; set; } = null!;
        [Required] public string Role { get; set; } = "User"; // e.g. "Admin", "Manager", "User"
    }

}
