using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Services
{
    public class TaskService
    {
        private readonly ITaskRepository _taskRepository;

        public TaskService(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public async Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                AssignedToUserId = dto.AssignedToUserId,
                AssignedByUserId = dto.AssignedByUserId,
                Priority = dto.Priority,
                Status = "Todo",
                DueDate = dto.DueDate,
                ProjectId = dto.ProjectId,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _taskRepository.CreateAsync(task);
            return MapToResponse(created);
        }

        public async Task<IEnumerable<TaskResponseDto>> 
            GetTasksByUserAsync(string userId)
        {
            var tasks = await _taskRepository.GetByUserIdAsync(userId);
            return tasks.Select(MapToResponse);
        }

        public async Task<IEnumerable<TaskResponseDto>> 
            GetTasksByProjectAsync(int projectId)
        {
            var tasks = await _taskRepository.GetByProjectIdAsync(projectId);
            return tasks.Select(MapToResponse);
        }

        public async Task<TaskResponseDto?> UpdateTaskStatusAsync(
            int taskId, UpdateTaskStatusDto dto)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null) return null;

            task.Status = dto.Status;
            task.UpdatedAt = DateTime.UtcNow;

            var updated = await _taskRepository.UpdateAsync(task);
            return MapToResponse(updated);
        }

        public async Task DeleteTaskAsync(int taskId)
        {
            await _taskRepository.DeleteAsync(taskId);
        }

        private TaskResponseDto MapToResponse(TaskItem task)
        {
            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                AssignedToUserId = task.AssignedToUserId,
                AssignedByUserId = task.AssignedByUserId,
                Priority = task.Priority,
                Status = task.Status,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                ProjectId = task.ProjectId,
                ProjectName = task.Project?.Name ?? string.Empty
            };
        }
    }
}
