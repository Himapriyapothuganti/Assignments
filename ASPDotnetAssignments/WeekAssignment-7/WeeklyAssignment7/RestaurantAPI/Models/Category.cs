using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.Models
{
    public class Category
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        public List<MenuItem>? MenuItems { get; set; }

    }
}
