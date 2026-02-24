using Application.DTOs;

namespace Application.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(string id);
    Task<bool> AssignRoleAsync(AssignRoleDto dto);
    Task<bool> DeactivateUserAsync(string userId);
    Task<bool> DeleteUserAsync(string userId);
}
