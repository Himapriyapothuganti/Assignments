using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _ctx;

    public EmployeeRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Employee>> GetAllAsync() =>
        await _ctx.Employees.Where(e => e.IsActive).OrderBy(e => e.FullName).ToListAsync();

    public async Task<Employee?> GetByIdAsync(int id) =>
        await _ctx.Employees.FirstOrDefaultAsync(e => e.Id == id);

    public async Task<Employee?> GetByUserIdAsync(string userId) =>
        await _ctx.Employees.FirstOrDefaultAsync(e => e.UserId == userId);

    public async Task<Employee> CreateAsync(Employee employee)
    {
        _ctx.Employees.Add(employee);
        await _ctx.SaveChangesAsync();
        return employee;
    }

    public async Task<Employee> UpdateAsync(Employee employee)
    {
        employee.UpdatedAt = DateTime.UtcNow;
        _ctx.Employees.Update(employee);
        await _ctx.SaveChangesAsync();
        return employee;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var emp = await _ctx.Employees.FindAsync(id);
        if (emp == null) return false;
        _ctx.Employees.Remove(emp);
        await _ctx.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id) =>
        await _ctx.Employees.AnyAsync(e => e.Id == id);
}
