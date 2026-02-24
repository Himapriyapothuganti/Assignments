using System.Security.Claims;
using Application.DTOs;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // All endpoints require authentication
[Produces("application/json")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeesController(IEmployeeService employeeService) => _employeeService = employeeService;

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  GET /api/employees — Admin & Manager only                          │
    // └─────────────────────────────────────────────────────────────────────┘
    /// <summary>Get all employees (Admin, Manager)</summary>
    [HttpGet]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Manager}")]
    public async Task<IActionResult> GetAll()
    {
        var employees = await _employeeService.GetAllEmployeesAsync();
        return Ok(ApiResponse<IEnumerable<EmployeeDto>>.Ok(employees));
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  GET /api/employees/{id} — Admin & Manager only                     │
    // └─────────────────────────────────────────────────────────────────────┘
    /// <summary>Get employee by ID (Admin, Manager)</summary>
    [HttpGet("{id:int}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Manager}")]
    public async Task<IActionResult> GetById(int id)
    {
        var emp = await _employeeService.GetEmployeeByIdAsync(id);
        if (emp == null) return NotFound(ApiResponse<string>.Fail($"Employee {id} not found."));
        return Ok(ApiResponse<EmployeeDto>.Ok(emp));
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  GET /api/employees/my-profile — All roles (own data only)          │
    // └─────────────────────────────────────────────────────────────────────┘
    /// <summary>Get current user's own employee profile</summary>
    [HttpGet("my-profile")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Manager},{Roles.Employee}")]
    public async Task<IActionResult> MyProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var emp = await _employeeService.GetMyProfileAsync(userId);
        if (emp == null) return NotFound(ApiResponse<string>.Fail("No employee profile linked to your account."));
        return Ok(ApiResponse<EmployeeDto>.Ok(emp));
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  POST /api/employees — Admin only                                   │
    // └─────────────────────────────────────────────────────────────────────┘
    /// <summary>Create employee record (Admin only)</summary>
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse<string>.Fail("Validation failed",
            ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

        var emp = await _employeeService.CreateEmployeeAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = emp.Id },
            ApiResponse<EmployeeDto>.Ok(emp, "Employee created successfully."));
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  PUT /api/employees/{id} — Admin & Manager                          │
    // └─────────────────────────────────────────────────────────────────────┘
    /// <summary>Update employee (Admin, Manager)</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Manager}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse<string>.Fail("Validation failed",
            ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

        var emp = await _employeeService.UpdateEmployeeAsync(id, dto);
        if (emp == null) return NotFound(ApiResponse<string>.Fail($"Employee {id} not found."));

        return Ok(ApiResponse<EmployeeDto>.Ok(emp, "Employee updated successfully."));
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  DELETE /api/employees/{id} — Admin only                            │
    // └─────────────────────────────────────────────────────────────────────┘
    /// <summary>Delete employee (Admin only)</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _employeeService.DeleteEmployeeAsync(id);
        if (!result) return NotFound(ApiResponse<string>.Fail($"Employee {id} not found."));
        return Ok(ApiResponse<string>.Ok("", "Employee deleted successfully."));
    }
}
