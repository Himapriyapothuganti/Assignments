using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Interfaces
{
    public interface IProjectRepository
    {
        Task<Project> CreateAsync(Project project);
        Task<Project?> GetByIdAsync(int id);
        Task<IEnumerable<Project>> GetAllAsync();
    }
}
