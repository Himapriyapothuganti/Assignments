namespace NotificationService.Application.DTOs
{
    public class CreateNotificationDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        // TaskAssigned / DeadlineReminder / StatusChanged
        public int? TaskId { get; set; }
        public string? TaskTitle { get; set; }
    }
}
