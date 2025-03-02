using backend.Models.Order;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; } = "";
        [Required]
        public double Price { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required, MaxLength(100)]
        public string Manufacturer { get; set; } = "";
    }
}
