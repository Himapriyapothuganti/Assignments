using Authentication.Application.Interfaces;
using Authentication.Domain.Entities;
using Authentication.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Authentication.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _users = database.GetCollection<User>("Users");
        }

        public async Task CreateAsync(User user)
        {
            await _users.InsertOneAsync(user);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _users
                .Find(u => u.Email == email)
                .FirstOrDefaultAsync();
        }
    }
}
