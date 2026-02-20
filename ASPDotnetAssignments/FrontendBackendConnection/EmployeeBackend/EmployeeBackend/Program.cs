using EmployeeBackend.Models;
using EmployeeBackend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace JwtAuthDemo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // -----------------------------
            // Services
            // -----------------------------

            builder.Services.AddControllers();

            builder.Services.AddDbContext<EmployeeContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            // Register JWT Service
            builder.Services.AddScoped<JWTService>();

            // Read JWT configuration
            var jwtKey = builder.Configuration["Jwt:Key"]!;
            var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
            var jwtAudience = builder.Configuration["Jwt:Audience"]!;
            var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

            // Configure Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(keyBytes),

                    ValidateIssuer = true,
                    ValidIssuer = jwtIssuer,

                    ValidateAudience = true,
                    ValidAudience = jwtAudience,

                    ValidateLifetime = true
                };
            });

            builder.Services.AddAuthorization();

            // Swagger with JWT Support
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer {token}'"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });

            builder.Services.AddCors(
                c =>
                { c.AddPolicy(
                    "AllowAngular",
                    policy =>
                    {
                        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                    }
                 );
                });

            var app = builder.Build();

            // -----------------------------
            // Database Migration + Seeding
            // -----------------------------
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<EmployeeContext>();
                db.Database.Migrate();

                if (!db.Users.Any())
                {
                    var hasher = new PasswordHasher<User>();

                    var admin = new User { Username = "admin", Role = "Admin" };
                    admin.PasswordHash = hasher.HashPassword(admin, "Admin123!");

                    var manager = new User { Username = "manager", Role = "Manager" };
                    manager.PasswordHash = hasher.HashPassword(manager, "Manager123!");

                    var user = new User { Username = "user", Role = "User" };
                    user.PasswordHash = hasher.HashPassword(user, "User123!");

                    db.Users.AddRange(admin, manager, user);
                }

                if (!db.Employees.Any())
                {
                    db.Employees.AddRange(
                        new Employee { Name = "Alice", Position = "Developer", Salary = 60000 },
                        new Employee { Name = "Bob", Position = "QA", Salary = 45000 }
                    );
                }

                db.SaveChanges();
            }

            // -----------------------------
            // Middleware Pipeline
            // -----------------------------
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAngular");

            app.UseAuthentication();   // MUST come before Authorization
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
