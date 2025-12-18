import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import {
  Menswear,
  Femalewear,
  Unisex,
  Caps,
  Shoes,
  Heels,
  Bags,
} from "../data";
import { useCart, ProductItem } from "../context/CardContext";
import Alert from "../components/Alert";

const clothingSizes = ["S", "M", "L", "XL", "XXL"];

const Product: React.FC = () => {

  const { category } = useParams<{ category?: string }>();
  const { addToCart } = useCart();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const getProducts = () => {
    switch (category) {
      case "menswear":
        return Menswear;
      case "femalewear":
        return Femalewear;
      case "unisex":
        return Unisex;
      case "cap":
        return Caps;
      case "shoes":
        return Shoes;
      case "heels":
        return Heels;
      case "bags":
        return Bags;
      default:
        return [
          ...Menswear,
          ...Femalewear,
          ...Unisex,
          ...Caps,
          ...Shoes,
          ...Heels,
          ...Bags,
        ];
    }
  };

  const products: ProductItem[] = getProducts();

  const displayName =
    category && category !== "all"
      ? `${category.charAt(0).toUpperCase()}${category.slice(1)} Collection`
      : "All Products";

  // Handle adding to cart
  const handleAddToCart = (item: ProductItem) => {
    const selectedSize = selectedSizes[item.name] || "";

    // Validate if size is required
    const needsSize =
      category === "menswear" ||
      category === "femalewear" ||
      category === "unisex" ||
      category === "shoes" ||
      category === "heels";

    if (needsSize && !selectedSize) {
      alert("Please select or enter your size before adding to cart.");
      return;
    }

    addToCart({ ...item, size: selectedSize });
    setAlertMessage(`${item.name} (${selectedSize || "No size"}) added to cart! ✔`);
  };

  // Handle selecting or typing size
  const handleSizeSelect = (productName: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productName]: size,
    }));
  };

  const fetchProduct = async ()=>{
    const product = await fetch('http://localhost:4444/api/product');
    const data = await product.json();
    console.log(data);
  }

  fetchProduct();
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
          {products.map((wear, index) => {
            // check if item needs size
            const isClothing =
              category === "menswear" ||
              category === "femalewear" ||
              category === "unisex";
            const isShoeOrHeel =
              category === "shoes" || category === "heels";
            const showSize = isClothing || isShoeOrHeel;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="overflow-hidden relative">
                  <img
                    src={wear.img}
                    alt={wear.name}
                    className="w-full h-32 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="px-2 py-4 lg:p-4 text-start">
                  <p className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                   <a href=""> {wear.name} </a>
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
                              className={`text-sm border px-2 py-1 rounded-md cursor-pointer transition-all ${
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
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    <BsCartPlus /> {wear.button}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Product;
