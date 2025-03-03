using backend.DTOs.Checkout;
using backend.Models.Order;

namespace backend.Service
{
    public interface IOrderService
    {
        public Task<List<Orders>> GetOrderByUserAsync(int userId);
        public Task<bool> CreateOrderAsync(CheckoutDTO checkoutDTO);
        public Task<List<OrderDetails>> GetOrderDetailsAsync(int orderId);
        public Task<bool> CancelOrderAsync(int orderId);
    }
}
