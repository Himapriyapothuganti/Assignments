using Microsoft.EntityFrameworkCore;

namespace RestaurantAPI.Models
{
    public class RestaurantContext : DbContext
    {
        //  Constructor Injection 
        public RestaurantContext(DbContextOptions<RestaurantContext> options)
            : base(options) { }

        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Category> Categories { get; set; }
    }
}
