using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly TaskManagementDbContext _context;

        public TaskRepository(TaskManagementDbContext context)
        {
            _context = context;
        }

        public async Task<TaskItem> CreateAsync(TaskItem task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id 
                                     && !t.IsDeleted);
        }

        public async Task<IEnumerable<TaskItem>> 
            GetByUserIdAsync(string userId)
        {
            return await _context.Tasks
                .Include(t => t.Project)
                .Where(t => t.AssignedToUserId == userId 
                       && !t.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskItem>> 
            GetByProjectIdAsync(int projectId)
        {
            return await _context.Tasks
                .Include(t => t.Project)
                .Where(t => t.ProjectId == projectId 
                       && !t.IsDeleted)
                .ToListAsync();
        }

        public async Task<TaskItem> UpdateAsync(TaskItem task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task DeleteAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                task.IsDeleted = true; // Soft delete
                await _context.SaveChangesAsync();
            }
        }
    }
}
