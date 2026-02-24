using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees => Set<Employee>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Salary).HasColumnType("decimal(18,2)");
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Rename Identity tables for cleaner schema
        builder.Entity<ApplicationUser>().ToTable("Users");
    }
}
