using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<UserService> _logger;

    public UserService(UserManager<ApplicationUser> userManager, ILogger<UserService> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = _userManager.Users.Where(u => u.IsActive).ToList();
        var result = new List<UserDto>();
        foreach (var u in users)
        {
            var roles = await _userManager.GetRolesAsync(u);
            result.Add(MapToDto(u, roles.FirstOrDefault() ?? ""));
        }
        return result;
    }

    public async Task<UserDto?> GetUserByIdAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return null;
        var roles = await _userManager.GetRolesAsync(user);
        return MapToDto(user, roles.FirstOrDefault() ?? "");
    }

    public async Task<bool> AssignRoleAsync(AssignRoleDto dto)
    {
        if (!Roles.AllRoles.Contains(dto.Role)) return false;

        var user = await _userManager.FindByIdAsync(dto.UserId);
        if (user == null) return false;

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        var result = await _userManager.AddToRoleAsync(user, dto.Role);

        _logger.LogInformation("Role {Role} assigned to user {UserId}", dto.Role, dto.UserId);
        return result.Succeeded;
    }

    public async Task<bool> DeactivateUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;
        user.IsActive = false;
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;
        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }

    private static UserDto MapToDto(ApplicationUser u, string role) => new()
    {
        Id = u.Id,
        Username = u.UserName ?? "",
        Email = u.Email ?? "",
        FullName = u.FullName,
        Role = role,
        IsActive = u.IsActive,
        CreatedAt = u.CreatedAt
    };
}
