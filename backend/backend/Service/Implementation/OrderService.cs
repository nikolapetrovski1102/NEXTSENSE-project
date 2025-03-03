using backend.DTOs.Checkout;
using backend.Models;
using backend.Models.Order;
using backend.Utility;
using Microsoft.EntityFrameworkCore;

namespace backend.Service.Implementation
{
    public class OrderService : IOrderService
    {
        private readonly NSDbContext _context;

        public OrderService(NSDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CancelOrderAsync(int orderId)
        {
            try
            {
                Orders order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                    return false;

                List<OrderDetails> orderDetails = await _context.OrderDetails
                    .Where(e => e.OrderId == orderId)
                    .ToListAsync();

                order.Status = OrderStatus.Canceled;

                foreach (var detail in orderDetails)
                {
                    var product = await _context.Products.FindAsync(detail.ProductId);
                    if (product != null)
                    {
                        product.Quantity += detail.Quantity;
                    }
                }

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error canceling order: {ex.Message}");
            }
        }


        public async Task<bool> CreateOrderAsync(CheckoutDTO checkoutDTO)
        {
            try
            {
                Orders orders = new()
                {
                    OrderAddress = checkoutDTO.shipmentInfo.address,
                    OrderCustomerFullname = checkoutDTO.shipmentInfo.full_name,
                    OrderCustomerPhone = checkoutDTO.shipmentInfo.phone,
                    OrderTotal = checkoutDTO.totalPrice,
                    OrderDate = DateTime.Now,
                    OrderDescription = checkoutDTO.shipmentInfo.description,
                    CustomerId = 1
                };

                await _context.Orders.AddAsync(orders);
                await _context.SaveChangesAsync();

                foreach (var item in checkoutDTO.cartItems)
                {
                    OrderDetails orderDetails = new()
                    {
                        OrderId = orders.Id,
                        ProductId = item.id,
                        Quantity = item.quantity
                    };

                    await _context.OrderDetails.AddAsync(orderDetails);
                    await _context.SaveChangesAsync();

                    Product product = await _context.Products.FindAsync(item.id);
                    product.Quantity -= item.quantity;

                    _context.SaveChanges();
                }

                return true;

            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Orders>> GetOrderByUserAsync(int userId)
        {
            try
            {
                return await _context.Orders.Where(e => e.CustomerId == userId).ToListAsync();
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<OrderDetails>> GetOrderDetailsAsync(int orderId)
        {
            try
            {
                return await _context.OrderDetails.Where(e => e.OrderId == orderId).Include(e => e.Product).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
