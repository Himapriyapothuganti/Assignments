using EmployeeBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using static EmployeeBackend.DTOs.EmployeeDTO;

namespace EmployeeBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeContext _db;
        public EmployeeController(EmployeeContext db) => _db = db;
        // GET: api/employee
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.Employees.ToListAsync();
            return Ok(list);
        }

        // GET: api/employee/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var e = await _db.Employees.FindAsync(id);
            if (e == null) return NotFound();
            return Ok(e);
        }

        // POST: api/employee  (Admin and Manager can create Employee Data)
        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Create(EmployeeCreateDto dto)
        {
            var e = new Employee { Name = dto.Name, Position = dto.Position, Salary = dto.Salary };
            _db.Employees.Add(e);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = e.Id }, e);
        }
        // PUT: api/employee/5  (Admin and Manager can update)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Update(int id, EmployeeUpdateDto dto)
        {
            var e = await _db.Employees.FindAsync(id);
            if (e == null) return NotFound();
            e.Name = dto.Name;
            e.Position = dto.Position;
            e.Salary = dto.Salary;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/employee/5  (only Admin can delete)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var e = await _db.Employees.FindAsync(id);
            if (e == null) return NotFound();
            _db.Employees.Remove(e);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
