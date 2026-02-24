using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = services.GetRequiredService<ILogger<AppDbContext>>();

        // ── Seed Roles ───────────────────────────────────────────────────────
        foreach (var role in Roles.AllRoles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
                logger.LogInformation("Created role: {Role}", role);
            }
        }

        // ── Seed Admin User ──────────────────────────────────────────────────
        const string adminEmail = "admin@company.com";
        const string adminUsername = "admin";
        const string adminPassword = "Admin@123456";

        var existing = await userManager.FindByEmailAsync(adminEmail);
        if (existing == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminUsername,
                Email = adminEmail,
                FullName = "System Administrator",
                EmailConfirmed = true,
                IsActive = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, Roles.Admin);
                logger.LogInformation("Admin user seeded: {Email}", adminEmail);
            }
            else
            {
                logger.LogError("Failed to seed admin: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        // ── Seed Manager User ────────────────────────────────────────────────
        const string managerEmail = "manager@company.com";
        var existingManager = await userManager.FindByEmailAsync(managerEmail);
        if (existingManager == null)
        {
            var managerUser = new ApplicationUser
            {
                UserName = "manager",
                Email = managerEmail,
                FullName = "John Manager",
                EmailConfirmed = true,
                IsActive = true
            };
            var result = await userManager.CreateAsync(managerUser, "Manager@123456");
            if (result.Succeeded)
                await userManager.AddToRoleAsync(managerUser, Roles.Manager);
        }

        // ── Seed Employee User ───────────────────────────────────────────────
        const string empEmail = "employee@company.com";
        var existingEmp = await userManager.FindByEmailAsync(empEmail);
        if (existingEmp == null)
        {
            var empUser = new ApplicationUser
            {
                UserName = "employee1",
                Email = empEmail,
                FullName = "Jane Employee",
                EmailConfirmed = true,
                IsActive = true
            };
            var result = await userManager.CreateAsync(empUser, "Employee@123456");
            if (result.Succeeded)
                await userManager.AddToRoleAsync(empUser, Roles.Employee);
        }
    }
}
