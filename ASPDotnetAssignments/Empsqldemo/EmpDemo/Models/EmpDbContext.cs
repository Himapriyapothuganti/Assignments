using Microsoft.EntityFrameworkCore;

namespace EmpDemo.Models
{
    public class EmpDbContext : DbContext
    {
        //constructor injection
        public EmpDbContext(DbContextOptions<EmpDbContext> options)
             : base(options) { }
        public DbSet<Emp> Emps { get; set; }
    }
}
