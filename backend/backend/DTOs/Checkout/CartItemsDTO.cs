namespace backend.DTOs.Checkout
{
    public class CartItemsDTO
    {
        public int id { get; set; }
        public string name { get; set; }
        public decimal price { get; set; }
        public int quantity { get; set; }
        public int stockQuantity { get; set; }
    }
}
