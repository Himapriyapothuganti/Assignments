namespace EmployeeBackend.DTOs
{
    public class EmployeeDTO
    {
        public record EmployeeCreateDto(string Name, string? Position, decimal Salary);
        public record EmployeeUpdateDto(string Name, string? Position, decimal Salary);
    }
}
