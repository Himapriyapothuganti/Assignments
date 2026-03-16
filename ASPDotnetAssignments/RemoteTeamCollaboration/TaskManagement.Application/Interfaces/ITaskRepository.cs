using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Interfaces
{
    public interface ITaskRepository
    {
        Task<TaskItem> CreateAsync(TaskItem task);
        Task<TaskItem?> GetByIdAsync(int id);
        Task<IEnumerable<TaskItem>> GetByUserIdAsync(string userId);
        Task<IEnumerable<TaskItem>> GetByProjectIdAsync(int projectId);
        Task<TaskItem> UpdateAsync(TaskItem task);
        Task DeleteAsync(int id);
    }
}
