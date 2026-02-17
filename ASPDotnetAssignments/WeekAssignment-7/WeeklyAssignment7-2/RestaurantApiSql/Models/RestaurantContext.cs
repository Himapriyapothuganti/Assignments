using Microsoft.EntityFrameworkCore;

namespace RestaurantApiSql.Models
{
    public class RestaurantContext :DbContext
    {
        public RestaurantContext(DbContextOptions<RestaurantContext> options)
            : base(options) { }

        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Category> Categories { get; set; }
    }
}
