using ProductsAPI.DTO;
using ProductsAPI.Models;

namespace ProductsAPI.Services
{
    public class ProductService : IProductService
    {
        private static List<Product> products = new List<Product> {

                    new Product{Id=1,Name="TV",Price=2000 },
                    new Product{Id=2,Name="AC",Price=3000 }

        };
        //GET ALL
        public List<ProductReadDTO> GetAllProducts()
        {
            return products.Select(p => new ProductReadDTO
            {
                Id = p.Id,
                Name = p.Name,
                Price = (decimal)p.Price

            }).ToList();
        }

        
        //delete product
        public bool DeleteProduct(int id)
        {
            var product=products.FirstOrDefault(p => p.Id == id);
            if(product==null) return false;
            products.Remove(product);
            return true;
        }

       
        //Get product by id
        public ProductReadDTO? GetProductById(int id)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return null;
            }
            return new ProductReadDTO
            {
                Id = product.Id,
                Name = product.Name,
                Price = (decimal)product.Price

            };
        }
        //update product
        public bool UpdateProduct(int id, ProductUpdateDTO updateDto)
        {
            var product=products.FirstOrDefault(p=>p.Id==id);
            if (product == null) return false;
            product.Name = updateDto.Name;
            product.Price = (decimal)updateDto.Price;
            return true;
        }
        //create product
        public ProductReadDTO CreateProduct(ProductCreateDTO createDto)
        {
            var newProduct = new Product
            {
                Id = products.Max(p => p.Id) + 1,
                Name = createDto.Name,
                Price = createDto.Price
            };
            products.Add(newProduct);
            return new ProductReadDTO
            {
                Id = newProduct.Id,
                Name = newProduct.Name,
                Price = (decimal)newProduct.Price
            };
        }
    }
}
