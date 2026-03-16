using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotificationService.Application.DTOs;
using NotificationService.Application.Services;

namespace NotificationService.API.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly NotificationAppService _service;

        public NotificationsController(
            NotificationAppService service)
        {
            _service = service;
        }

        // POST: Create notification (called by TaskManagement)
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateNotificationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // GET: All notifications for a user
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetAll(string userId)
        {
            var result = await _service.GetAllByUserAsync(userId);
            return Ok(result);
        }

        // GET: Only unread notifications for a user
        [HttpGet("{userId}/unread")]
        public async Task<IActionResult> GetUnread(string userId)
        {
            var result = await _service
                .GetUnreadByUserAsync(userId);
            return Ok(result);
        }

        // PUT: Mark single notification as read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var result = await _service.MarkAsReadAsync(id);
            if (result == null)
                return NotFound("Notification not found.");
            return Ok(result);
        }

        // PUT: Mark ALL notifications as read for a user
        [HttpPut("{userId}/read-all")]
        public async Task<IActionResult> MarkAllAsRead(
            string userId)
        {
            await _service.MarkAllAsReadAsync(userId);
            return Ok("All notifications marked as read.");
        }
    }
}
