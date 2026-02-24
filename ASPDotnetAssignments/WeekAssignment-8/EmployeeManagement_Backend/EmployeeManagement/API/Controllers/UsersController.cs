using Application.DTOs;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.Admin)] // Entire controller restricted to Admin
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService) => _userService = userService;

    /// <summary>Get all users</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(ApiResponse<IEnumerable<UserDto>>.Ok(users));
    }

    /// <summary>Get user by ID</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound(ApiResponse<string>.Fail("User not found."));
        return Ok(ApiResponse<UserDto>.Ok(user));
    }

    /// <summary>Assign a role to a user</summary>
    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse<string>.Fail("Validation failed",
            ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

        var result = await _userService.AssignRoleAsync(dto);
        if (!result) return BadRequest(ApiResponse<string>.Fail("Role assignment failed. Invalid user or role."));

        return Ok(ApiResponse<string>.Ok("", $"Role '{dto.Role}' assigned successfully."));
    }

    /// <summary>Deactivate a user account</summary>
    [HttpPatch("{id}/deactivate")]
    public async Task<IActionResult> Deactivate(string id)
    {
        var result = await _userService.DeactivateUserAsync(id);
        if (!result) return NotFound(ApiResponse<string>.Fail("User not found."));
        return Ok(ApiResponse<string>.Ok("", "User deactivated."));
    }

    /// <summary>Permanently delete a user</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result) return NotFound(ApiResponse<string>.Fail("User not found."));
        return Ok(ApiResponse<string>.Ok("", "User deleted."));
    }
}
