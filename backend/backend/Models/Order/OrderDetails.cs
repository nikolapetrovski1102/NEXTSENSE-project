using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Order
{
    [Table("Order_Details")]
    public class OrderDetails
    {
        [Required]
        [ForeignKey("Order")]
        public int OrderId { get; set; }
        [Required]
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        [Required]
        public int Quantity { get; set; }

        public virtual Orders Order { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
