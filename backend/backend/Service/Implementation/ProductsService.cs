using backend.DTOs.Filters;
using backend.Models;
using backend.Utility;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace backend.Service.Implementation
{
    public class ProductsService : IProductsService
    {
        private readonly NSDbContext _context;
        private readonly IConfiguration _configuration;

        public ProductsService(NSDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<List<Product>> GetProductsAsync(int offset, int pageSize)
        {
            try
            {
                var parameter1 = new SqlParameter("@pageNumber", SqlDbType.Int)
                {
                    Value = offset
                };

                var parameter2 = new SqlParameter("@pageSize", SqlDbType.Int)
                {
                    Value = pageSize
                };

                var result = await _context.Products
                                            .FromSqlRaw("EXEC GetProducts @pageNumber, @pageSize", parameter1, parameter2)
                                            .ToListAsync();

                return result;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<string>> GetManufacturersAsync()
        {
            try
            {
                return await _context.Products.Select(e => e.Manufacturer).Distinct().ToListAsync();
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Product>> GetFilteredProductsAsync(FilterDTO filters)
        {
            try
            {
                if (!String.IsNullOrEmpty(filters.sort))
                {
                    List<Product> ProductList = filters.sort == "Price: Low to High" ? await _context.Products.OrderBy(e => e.Price).ToListAsync() : await _context.Products.OrderByDescending(e => e.Price).ToListAsync();
                    if (filters.manufacturers.Count > 0)
                    {
                        return ProductList.Where(e => filters.manufacturers.Contains(e.Manufacturer)).ToList();
                    }
                    else
                    {
                        return ProductList;
                    }
                }
                else
                {
                    return await _context.Products.Where(e => filters.manufacturers.Contains(e.Manufacturer)).ToListAsync();
                }
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
