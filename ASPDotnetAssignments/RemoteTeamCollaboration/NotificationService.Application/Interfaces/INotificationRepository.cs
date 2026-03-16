using NotificationService.Domain.Entities;

namespace NotificationService.Application.Interfaces
{
    public interface INotificationRepository
    {
        Task<Notification> CreateAsync(Notification notification);
        Task<IEnumerable<Notification>> GetByUserIdAsync(string userId);
        Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(
            string userId);
        Task<Notification?> GetByIdAsync(int id);
        Task<Notification> UpdateAsync(Notification notification);
        Task MarkAllAsReadAsync(string userId);
    }
}
