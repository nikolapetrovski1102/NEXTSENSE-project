using backend.Models.Order;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string FullName { get; set; } = "";
        [Required, MaxLength(50)]
        public string Username { get; set; } = "";
        [Required, EmailAddress]
        public string Email { get; set; } = "";
        [Required]
        public string Password { get; set; } = "";
        [Required]
        public string PhoneNumber { get; set; } = "";

        public virtual ICollection<Orders>? OrdersList { get; set; } = new List<Orders>();
    }
}
