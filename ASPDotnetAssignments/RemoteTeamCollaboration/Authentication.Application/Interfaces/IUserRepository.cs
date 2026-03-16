using Authentication.Domain.Entities;

namespace Authentication.Application.Interfaces
{
    public interface IUserRepository
    {
        Task CreateAsync(User user);
        Task<User?> GetByEmailAsync(string email);
    }
}
