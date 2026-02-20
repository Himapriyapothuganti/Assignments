using BasicAuthenticationDemo.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace BasicAuthenticationDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AuthContext _context;

        public UserController(AuthContext context)
        {
            _context = context;
        }
        [HttpPost("Register")]

        public ActionResult<User> Register(UserDTO userdto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = new User
            {
                FirstName = userdto.FirstName,
                LastName = userdto.LastName,
                Email = userdto.Email,
                Password = userdto.Password
            };
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(user);

        }

        [HttpPost("Login")]
        public IActionResult Login(LoginDTO logindto)
        {
            var validUser = _context.Users.FirstOrDefault(u => u.Email == logindto.Email && u.Password == logindto.Password && u.IsActive == true);
            if (validUser == null)
                return NotFound();
            return Ok(validUser);


        }


        [HttpGet("{id}")]
        public ActionResult GetUserprofile(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpGet("{email}")]
        public ActionResult GetUserbyEmail (string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if(user == null)
                return NotFound();
            return Ok(user);
        }
    }
}
