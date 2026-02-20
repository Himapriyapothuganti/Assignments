using EmployeeBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace EmployeeBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // only Admins can manage users in this sample
    public class UserController : ControllerBase
    {
        private readonly EmployeeContext _db;
        public UserController(EmployeeContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.Users.Select(u => new { u.Id, u.Username, u.Role }).ToListAsync();
            return Ok(users);
        }

        [HttpPost("{id}/role")]
        public async Task<IActionResult> SetRole(int id, [FromQuery] string role)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            user.Role = role;
            await _db.SaveChangesAsync();
            return NoContent();
        }

    }
}

