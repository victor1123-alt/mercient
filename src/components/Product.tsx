import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  Menswear,
  Femalewear,
  Unisex,
  Caps,
  Shoes,
  Heels,
  Bags,
} from "../data";
import { useCart, type ProductItem } from "../context/CardContext";
import Alert from "../components/Alert";
import ProductModal from "../components/ProductModal";

const clothingSizes = ["S", "M", "L", "XL", "XXL"];

const Product: React.FC = () => {

  const { category } = useParams<{ category?: string }>();
  const { addToCart } = useCart();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<null | ProductItem>(null);

  const getProducts = () => {
    switch (category) {
      case "menswear":
        return Menswear.map((p) => ({ ...p, category: "menswear" }));
      case "femalewear":
        return Femalewear.map((p) => ({ ...p, category: "femalewear" }));
      case "unisex":
        return Unisex.map((p) => ({ ...p, category: "unisex" }));
      case "cap":
        return Caps.map((p) => ({ ...p, category: "cap" }));
      case "shoes":
        return Shoes.map((p) => ({ ...p, category: "shoes" }));
      case "heels":
        return Heels.map((p) => ({ ...p, category: "heels" }));
      case "bags":
        return Bags.map((p) => ({ ...p, category: "bags" }));
      default:
        return [
          ...Menswear.map((p) => ({ ...p, category: "menswear" })),
          ...Femalewear.map((p) => ({ ...p, category: "femalewear" })),
          ...Unisex.map((p) => ({ ...p, category: "unisex" })),
          ...Caps.map((p) => ({ ...p, category: "cap" })),
          ...Shoes.map((p) => ({ ...p, category: "shoes" })),
          ...Heels.map((p) => ({ ...p, category: "heels" })),
          ...Bags.map((p) => ({ ...p, category: "bags" })),
        ];
    }
  };

  const products: ProductItem[] = getProducts();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // show 8 items per page
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const displayName =
    category && category !== "all"
      ? `${category.charAt(0).toUpperCase()}${category.slice(1)} Collection`
      : "All Products";

  // Handle adding to cart
  const handleAddToCart = (item: ProductItem) => {
    const selectedSize = selectedSizes[item.name] || "";

    // Validate if size is required for this specific item (use item's category)
    const itemCat = item.category;
    const needsSize =
      itemCat === "menswear" ||
      itemCat === "femalewear" ||
      itemCat === "unisex" ||
      itemCat === "shoes" ||
      itemCat === "heels";

    if (needsSize && !selectedSize) {
      // Instead of alerting, open the product modal so user can pick size/color on mobile
      setSelectedProduct(item);
      return;
    }

    addToCart({ ...item, size: selectedSize, color: item.color, category: item.category });
    setAlertMessage(`${item.name} (${selectedSize || "No size"}) added to cart! ✔`);
  };

  // Handle selecting or typing size
  const handleSizeSelect = (productName: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productName]: size,
    }));
  };

  // fetch product example - run once on mount if needed
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:4444/api/product");
        if (!res.ok) return;
        const data = await res.json();
        console.log("Fetched products sample:", data);
      } catch (err) {
        // log network errors during dev for easier debugging
        console.error(err);
      }
    };
    fetchProduct();
  }, []);
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {paginatedProducts.map((wear, index) => {
            // determine item-specific category so sizes show even when viewing 'All Products'
            const prodCat = (wear as any).category || category;
            const isClothing =
              prodCat === "menswear" || prodCat === "femalewear" || prodCat === "unisex";
            const isShoeOrHeel = prodCat === "shoes" || prodCat === "heels";
            const showSize = isClothing || isShoeOrHeel;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="overflow-hidden relative cursor-pointer" onClick={() => setSelectedProduct(wear)}>
                  <img
                    src={wear.img}
                    alt={wear.name}
                    className="w-full h-32 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="px-2 py-4 lg:p-4 text-start">
                  <p className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                   <button onClick={() => setSelectedProduct(wear)} className="text-left w-full hover:underline">{wear.name}</button>
                  </p>
                  <p className="text-primary font-bold mb-3">{wear.price}</p>

                  {/* 👕 Show Size Option only if needed */}
                  {showSize && (
                    <div className="mb-3">
                      {isClothing && (
                        <div className="flex flex-wrap gap-2">
                          {clothingSizes.map((size, i) => (
                            <span
                              key={i}
                              onClick={() => handleSizeSelect(wear.name, size)}
                              className={`text-sm border px-2 py-1 rounded-md  cursor-pointer transition-all ${
                                selectedSizes[wear.name] === size
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
                          value={selectedSizes[wear.name] || ""}
                          onChange={(e) =>
                            handleSizeSelect(wear.name, e.target.value)
                          }
                          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(wear)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    <BsCartPlus /> {wear.button}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Product Detail Modal */}
        <ProductModal
          isOpen={!!selectedProduct}
          product={selectedProduct as ProductItem}
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
      </div>
    </section>
  );
};

export default Product;
