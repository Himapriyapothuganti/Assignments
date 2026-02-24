using System.Security.Claims;
using Application.DTOs;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class DashboardController : ControllerBase
{
    private readonly IEmployeeService _employeeService;
    private readonly IUserService _userService;
    private readonly IAuthService _authService;

    public DashboardController(IEmployeeService emp, IUserService user, IAuthService auth)
    {
        _employeeService = emp;
        _userService = user;
        _authService = auth;
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  ADMIN DASHBOARD                                                    │
    // └─────────────────────────────────────────────────────────────────────┘
    /// <summary>Admin Dashboard — full system overview</summary>
    [HttpGet("admin")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> AdminDashboard()
    {
        var employees = (await _employeeService.GetAllEmployeesAsync()).ToList();
        var users = (await _userService.GetAllUsersAsync()).ToList();

        var data = new
        {
            Role = Roles.Admin,
            TotalEmployees = employees.Count,
            ActiveEmployees = employees.Count(e => e.IsActive),
            TotalUsers = users.Count,
            UsersByRole = new
            {
                Admins = users.Count(u => u.Role == Roles.Admin),
                Managers = users.Count(u => u.Role == Roles.Manager),
                Employees = users.Count(u => u.Role == Roles.Employee)
            },
            RecentEmployees = employees.OrderByDescending(e => e.CreatedAt).Take(5),
            AllEmployees = employees,
            AllUsers = users
        };

        return Ok(ApiResponse<object>.Ok(data, "Admin Dashboard"));
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  MANAGER DASHBOARD                                                  │
    // └─────────────────────────────────────────────────────────────────────┘
    /// <summary>Manager Dashboard — employee management overview</summary>
    [HttpGet("manager")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Manager}")]
    public async Task<IActionResult> ManagerDashboard()
    {
        var employees = (await _employeeService.GetAllEmployeesAsync()).ToList();

        var data = new
        {
            Role = Roles.Manager,
            TotalEmployees = employees.Count,
            ActiveEmployees = employees.Count(e => e.IsActive),
            DepartmentSummary = employees
                .GroupBy(e => e.Department)
                .Select(g => new { Department = g.Key, Count = g.Count() }),
            AllEmployees = employees,
            // Managers cannot see user management or role data
            Permissions = new
            {
                CanView = true,
                CanUpdate = true,
                CanDelete = false,
                CanManageRoles = false
            }
        };

        return Ok(ApiResponse<object>.Ok(data, "Manager Dashboard"));
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  EMPLOYEE DASHBOARD                                                 │
    // └─────────────────────────────────────────────────────────────────────┘
    /// <summary>Employee Dashboard — own profile only</summary>
    [HttpGet("employee")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Manager},{Roles.Employee}")]
    public async Task<IActionResult> EmployeeDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? "";
        var profile = await _employeeService.GetMyProfileAsync(userId);

        var data = new
        {
            Role = Roles.Employee,
            Username = userName,
            MyProfile = profile,
            Permissions = new
            {
                CanView = true,
                CanUpdate = false,
                CanDelete = false,
                CanViewOthers = false,
                CanManageRoles = false
            }
        };

        return Ok(ApiResponse<object>.Ok(data, "Employee Dashboard"));
    }
}
