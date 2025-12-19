import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCart } from "../context/CardContext";
import { productAPI } from "../utils/api";
import Alert from "../components/Alert";
import ProductModal from "../components/ProductModal";

interface ProductData {
  _id: string;
  productName: string;
  description?: string;
  price: number;
  category?: string;
  isAvailable: boolean;
}

const clothingSizes = ["S", "M", "L", "XL", "XXL"];

const Product: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { addToCart, loading } = useCart();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts();
        let fetchedProducts = response.data;
        
        // Filter by category if specified
        if (category) {
          fetchedProducts = fetchedProducts.filter((p: ProductData) => 
            p.category?.toLowerCase() === category.toLowerCase()
          );
        }
        
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    fetchProducts();
  }, [category]);

  const handleAddToCart = async (product: ProductData) => {
    try {
      await addToCart(product._id, 1);
      setAlertMessage(`${product.productName} added to cart!`);
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage('Failed to add to cart');
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const displayName =
    category && category !== "all"
      ? `${category.charAt(0).toUpperCase()}${category.slice(1)} Collection`
      : "All Products";

  // Handle selecting or typing size
  const handleSizeSelect = (productName: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productName]: size,
    }));
  };

  if (loadingProducts) {
    return (
      <section className="py-10 bg-milk dark:bg-darkblack transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Loading Products...
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-milk dark:bg-darkblack transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          {displayName}
        </h2>

        {/* ✅ Alert */}
        {alertMessage && (
          <Alert
            message={alertMessage}
            type="success"
            onClose={() => setAlertMessage(null)}
          />
        )}

        {(() => {
          const totalPages = Math.ceil(products.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
          return (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {paginatedProducts.map((product) => {
            // check if item needs size
            const isClothing =
              product.category === "menswear" ||
              product.category === "femalewear" ||
              product.category === "unisex";
            const isShoeOrHeel =
              product.category === "shoes" || product.category === "heels";
            const showSize = isClothing || isShoeOrHeel;

            return (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="overflow-hidden relative cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" // Placeholder image
                    alt={product.productName}
                    className="w-full h-32 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="px-2 py-4 lg:p-4 text-start">
                  <p className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                    <a href="">{product.productName}</a>
                  </p>
                  <p className="text-primary font-bold mb-3">N{product.price}</p>

                  {/* 👕 Show Size Option only if needed */}
                  {showSize && (
                    <div className="mb-3">
                      {isClothing && (
                        <div className="flex flex-wrap gap-2">
                          {clothingSizes.map((size, i) => (
                            <span
                              key={i}
                              onClick={() => handleSizeSelect(product.productName, size)}
                              className={`text-sm border px-2 py-1 rounded-md cursor-pointer transition-all ${
                                selectedSizes[product.productName] === size
                                  ? "bg-primary text-white border-primary"
                                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white"
                              }`}
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      )}

                      {isShoeOrHeel && (
                        <input
                          type="number"
                          placeholder="Enter your size (e.g., 42)"
                          value={selectedSizes[product.productName] || ""}
                          onChange={(e) =>
                            handleSizeSelect(product.productName, e.target.value)
                          }
                          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
                  >
                    <BsCartPlus /> {loading ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Product Detail Modal */}
        <ProductModal
          isOpen={!!selectedProduct}
          product={selectedProduct as ProductData}
          category={category}
          onClose={() => setSelectedProduct(null)}
          onAdded={(msg) => setAlertMessage(msg)}
        />

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <FiChevronLeft />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 py-1 rounded ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <FiChevronRight />
          </button>
        </div>
      </>
    );
  })()}
      </div>
    </section>
  );
};

export default Product;
