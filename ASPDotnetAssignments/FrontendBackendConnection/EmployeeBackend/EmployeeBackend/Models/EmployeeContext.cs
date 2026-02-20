using Microsoft.EntityFrameworkCore;

namespace EmployeeBackend.Models
{
    public class EmployeeContext :DbContext
    {
        public EmployeeContext(DbContextOptions<EmployeeContext> options)
        : base(options)
        {

        }
        
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<User> Users => Set<User>();

    }
}
