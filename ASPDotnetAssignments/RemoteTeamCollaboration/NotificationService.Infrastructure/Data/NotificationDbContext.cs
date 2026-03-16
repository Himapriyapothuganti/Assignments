using Microsoft.EntityFrameworkCore;
using NotificationService.Domain.Entities;

namespace NotificationService.Infrastructure.Data
{
    public class NotificationDbContext : DbContext
    {
        public NotificationDbContext(
            DbContextOptions<NotificationDbContext> options)
            : base(options) { }

        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(
            ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(n => n.Id);

                entity.Property(n => n.UserId)
                      .IsRequired();

                entity.Property(n => n.Title)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(n => n.Message)
                      .IsRequired()
                      .HasMaxLength(500);

                entity.Property(n => n.Type)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(n => n.TaskTitle)
                      .HasMaxLength(300);

                // Index for fast user queries
                entity.HasIndex(n => n.UserId);

                // Index for unread queries
                entity.HasIndex(n => new { n.UserId, n.IsRead });
            });
        }
    }
}
