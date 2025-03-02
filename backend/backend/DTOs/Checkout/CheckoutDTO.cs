namespace backend.DTOs.Checkout
{
    public class CheckoutDTO
    {
        public List<CartItemsDTO> cartItems { get; set; } = new List<CartItemsDTO>();
        public ShipmentInfoDTO shipmentInfo { get; set; }
        public int totalPrice { get; set; }
    }
}
