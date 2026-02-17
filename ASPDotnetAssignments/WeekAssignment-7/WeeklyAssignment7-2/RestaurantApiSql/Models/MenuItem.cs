using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RestaurantApiSql.Models
{
    public class MenuItem
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Range(1, 10000)]
        public decimal Price { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        [JsonIgnore]

        public Category? Category { get; set; }
    }

}
