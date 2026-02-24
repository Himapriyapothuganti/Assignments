using API.Extensions;
using API.Middleware;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ── Register Services ────────────────────────────────────────────────────────
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddIdentityConfig();
builder.Services.AddJwtAuth(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerWithJwt();

// CORS (configure for your frontend URL in production)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(
                builder.Configuration["Frontend:Url"] ?? "http://localhost:3000",
                "http://localhost:4200",  // Angular
                "http://localhost:5173"   // Vite/React
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// ── Auto-migrate & Seed ──────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync(); // Run pending migrations

    await DbSeeder.SeedAsync(scope.ServiceProvider); // Seed roles + default users
}

// ── Middleware Pipeline ──────────────────────────────────────────────────────
app.UseMiddleware<ExceptionMiddleware>(); // Global exception handler

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Employee Management API v1");
        c.RoutePrefix = string.Empty; // Swagger at root URL
        c.DisplayRequestDuration();
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication(); // Must come before UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();
