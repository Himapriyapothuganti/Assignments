using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SeedDataDemo.Models
{
    [Table("Countries")]
    public class Country
    {
        [Key]
        public int CountryId { get; set; }
        [Required]
        [MaxLength(100)]
        public string CountryName { get; set; }
        [Required]
        [MaxLength(10)]
        public string CountryCode { get; set; }
        // Navigation Property
        [JsonIgnore]
        public ICollection<State> States { get; set; }
    }
}
