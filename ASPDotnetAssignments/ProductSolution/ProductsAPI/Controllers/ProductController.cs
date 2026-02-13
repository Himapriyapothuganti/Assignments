using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductsAPI.DTO;
using ProductsAPI.Services;
using System.Runtime.CompilerServices;

namespace ProductsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }
        // get all products 
        [HttpGet]
        public IActionResult GetProducts()
        {
            return Ok(_productService.GetAllProducts());
        }
        // Get product by id 
        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _productService.GetProductById(id);
            if (product == null)
            {

                return NotFound();
            }
            return Ok(product);
        }
        //post 
        [HttpPost]
        public IActionResult CreateProduct(ProductCreateDTO dto)
        {
            var createdproduct = _productService.CreateProduct(dto);
            return CreatedAtAction(nameof(GetProductById), new { id = createdproduct.Id }, createdproduct);
        }
        // update 
        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id,ProductUpdateDTO dto)
        {
            
            if (!_productService.UpdateProduct(id,dto))
            {
                return NotFound();
            }
            return NoContent();
        }
        [HttpDelete]
        public IActionResult DeleteProduct(int id)
        {
            var product = _productService.DeleteProduct(id);
            if (!product)
            {
                return NotFound();
            }
            return NoContent(); 

        }



    }
}
