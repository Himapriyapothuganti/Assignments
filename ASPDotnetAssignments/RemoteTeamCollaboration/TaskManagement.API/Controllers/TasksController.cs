using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Services;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(
            [FromBody] CreateTaskDto dto)
        {
            var result = await _taskService.CreateTaskAsync(dto);
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetTasksByUser(string userId)
        {
            var tasks = await _taskService.GetTasksByUserAsync(userId);
            return Ok(tasks);
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetTasksByProject(int projectId)
        {
            var tasks = await _taskService
                .GetTasksByProjectAsync(projectId);
            return Ok(tasks);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id, [FromBody] UpdateTaskStatusDto dto)
        {
            var result = await _taskService
                .UpdateTaskStatusAsync(id, dto);
            if (result == null) 
                return NotFound("Task not found.");
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            await _taskService.DeleteTaskAsync(id);
            return Ok("Task deleted successfully.");
        }
    }
}
