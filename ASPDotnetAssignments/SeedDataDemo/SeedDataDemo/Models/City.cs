using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SeedDataDemo.Models
{
    [Table("Cities")]
    public class City
    {
        [Key]
        public int CityId { get; set; }
        [Required]
        [MaxLength(100)]
        public string CityName { get; set; }
        public int StateId { get; set; } // Foreign Key
        // Navigation Property
        [JsonIgnore]
        public State State { get; set; }
    }
}
