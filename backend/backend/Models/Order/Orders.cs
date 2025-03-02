using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Order
{
    public class Orders
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [ForeignKey("User")]
        public int CustomerId { get; set; }
        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        [Required]
        public string OrderDescription { get; set; } = string.Empty;
        [Required]
        public string OrderCustomerFullname { get; set; } = string.Empty;
        [Required]
        public string OrderAddress { get; set; } = string.Empty;
        [Required]
        public string OrderCustomerPhone { get; set; } = string.Empty;
        [Required]
        public int OrderTotal { get; set; }
        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public virtual User Customer { get; set; } = null!;
        public virtual ICollection<OrderDetails> OrderDetailsList { get; set; } = new List<OrderDetails>();

    }

    public enum OrderStatus
    {
        Pending = 1,
        Completed = 2,
        Canceled = 3,
        Shipped = 4,
        Delivered = 5
    }
}
