using NotificationService.Application.DTOs;
using NotificationService.Application.Interfaces;
using NotificationService.Domain.Entities;

namespace NotificationService.Application.Services
{
    public class NotificationAppService
    {
        private readonly INotificationRepository _repository;

        public NotificationAppService(
            INotificationRepository repository)
        {
            _repository = repository;
        }

        public async Task<NotificationResponseDto> CreateAsync(
            CreateNotificationDto dto)
        {
            var notification = new Notification
            {
                UserId = dto.UserId,
                Title = dto.Title,
                Message = dto.Message,
                Type = dto.Type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                TaskId = dto.TaskId,
                TaskTitle = dto.TaskTitle
            };

            var created = await _repository.CreateAsync(notification);
            return MapToResponse(created);
        }

        public async Task<IEnumerable<NotificationResponseDto>>
            GetAllByUserAsync(string userId)
        {
            var notifications = await _repository
                .GetByUserIdAsync(userId);
            return notifications.Select(MapToResponse);
        }

        public async Task<IEnumerable<NotificationResponseDto>>
            GetUnreadByUserAsync(string userId)
        {
            var notifications = await _repository
                .GetUnreadByUserIdAsync(userId);
            return notifications.Select(MapToResponse);
        }

        public async Task<NotificationResponseDto?> MarkAsReadAsync(
            int notificationId)
        {
            var notification = await _repository
                .GetByIdAsync(notificationId);

            if (notification == null) return null;

            notification.IsRead = true;
            var updated = await _repository.UpdateAsync(notification);
            return MapToResponse(updated);
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            await _repository.MarkAllAsReadAsync(userId);
        }

        private NotificationResponseDto MapToResponse(
            Notification n)
        {
            return new NotificationResponseDto
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                TaskId = n.TaskId,
                TaskTitle = n.TaskTitle
            };
        }
    }
}
