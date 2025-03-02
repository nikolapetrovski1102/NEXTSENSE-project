using backend.DTOs.Filters;
using backend.Models;

namespace backend.Service
{
    public interface IProductsService
    {
        public Task<List<Product>> GetProductsAsync(int offset, int pageSize);
        public Task<List<string>> GetManufacturersAsync();
        public Task<List<Product>> GetFilteredProductsAsync(FilterDTO filters);
    }
}
