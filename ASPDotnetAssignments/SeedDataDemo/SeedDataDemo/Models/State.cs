using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SeedDataDemo.Models
{
    [Table("States")]
    public class State
    {
        [Key]
        public int StateId { get; set; }
        [Required]
        [MaxLength(100)]
        public string StateName { get; set; }
        public int CountryId { get; set; } // Foreign Key
        // Navigation Properties
        [JsonIgnore]
        public Country Country { get; set; }
        [JsonIgnore]
        public ICollection<City> Cities { get; set; }
    }
}
