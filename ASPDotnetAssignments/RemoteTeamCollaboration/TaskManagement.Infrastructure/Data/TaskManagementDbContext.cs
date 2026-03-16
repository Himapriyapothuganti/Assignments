using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Infrastructure.Data
{
    public class TaskManagementDbContext : DbContext
    {
        public TaskManagementDbContext(
            DbContextOptions<TaskManagementDbContext> options)
            : base(options) { }

        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Project> Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Project config
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name)
                      .IsRequired().HasMaxLength(200);
                entity.Property(p => p.CreatedByUserId)
                      .IsRequired();
            });

            // TaskItem config
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Title)
                      .IsRequired().HasMaxLength(300);
                entity.Property(t => t.Status)
                      .IsRequired().HasMaxLength(50);
                entity.Property(t => t.Priority)
                      .IsRequired().HasMaxLength(20);
                entity.HasOne(t => t.Project)
                      .WithMany(p => p.Tasks)
                      .HasForeignKey(t => t.ProjectId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
