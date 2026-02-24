using Application.DTOs;

namespace Application.Interfaces;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync();
    Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
    Task<EmployeeDto?> GetMyProfileAsync(string userId);
    Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto);
    Task<EmployeeDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto);
    Task<bool> DeleteEmployeeAsync(int id);
}
