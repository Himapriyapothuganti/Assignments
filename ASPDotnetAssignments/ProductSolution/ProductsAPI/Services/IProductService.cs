using ProductsAPI.DTO;

namespace ProductsAPI.Services
{
    public interface IProductService
    {
        List<ProductReadDTO> GetAllProducts();
        ProductReadDTO? GetProductById(int id);
        ProductReadDTO CreateProduct(ProductCreateDTO createDto);
        bool UpdateProduct(int id, ProductUpdateDTO updateDto);
        bool DeleteProduct(int id);

    }
}
