using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Service;
using backend.DTOs.Filters;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly IProductsService _productService;

        public ProductsController(IProductsService productService)
        {
            _productService = productService;
        }

        [HttpGet("get-all-products/{offset}/{pageSize}")]
        public async Task<IActionResult> GetProducts(int offset, int pageSize)
        {
            try
            {
                return Ok(await _productService.GetProductsAsync(offset, pageSize));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("get-all-manufacturers")]
        public async Task<IActionResult> GetManufacturers()
        {
            try
            {
                return Ok(await _productService.GetManufacturersAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("filtered-products")]
        public async Task<IActionResult> GetFilteredProducts([FromBody] FilterDTO filters)
        {
            try
            {
                return Ok(await _productService.GetFilteredProductsAsync(filters));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

    }
}
