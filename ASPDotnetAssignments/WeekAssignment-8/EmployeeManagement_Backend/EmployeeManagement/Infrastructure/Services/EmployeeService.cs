using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repo;

    public EmployeeService(IEmployeeRepository repo) => _repo = repo;

    public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
    {
        var employees = await _repo.GetAllAsync();
        return employees.Select(MapToDto);
    }

    public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        return emp == null ? null : MapToDto(emp);
    }

    public async Task<EmployeeDto?> GetMyProfileAsync(string userId)
    {
        var emp = await _repo.GetByUserIdAsync(userId);
        return emp == null ? null : MapToDto(emp);
    }

    public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto)
    {
        var employee = new Employee
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            Department = dto.Department,
            Position = dto.Position,
            Salary = dto.Salary,
            HireDate = dto.HireDate,
            UserId = dto.UserId
        };
        var created = await _repo.CreateAsync(employee);
        return MapToDto(created);
    }

    public async Task<EmployeeDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto)
    {
        var emp = await _repo.GetByIdAsync(id);
        if (emp == null) return null;

        if (dto.FullName != null) emp.FullName = dto.FullName;
        if (dto.Phone != null) emp.Phone = dto.Phone;
        if (dto.Department != null) emp.Department = dto.Department;
        if (dto.Position != null) emp.Position = dto.Position;
        if (dto.Salary.HasValue) emp.Salary = dto.Salary.Value;
        if (dto.IsActive.HasValue) emp.IsActive = dto.IsActive.Value;

        var updated = await _repo.UpdateAsync(emp);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteEmployeeAsync(int id) =>
        await _repo.DeleteAsync(id);

    // ── Mapper ────────────────────────────────────────────────────────────────

    private static EmployeeDto MapToDto(Employee e) => new()
    {
        Id = e.Id,
        FullName = e.FullName,
        Email = e.Email,
        Phone = e.Phone,
        Department = e.Department,
        Position = e.Position,
        Salary = e.Salary,
        HireDate = e.HireDate,
        IsActive = e.IsActive,
        UserId = e.UserId,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };
}
