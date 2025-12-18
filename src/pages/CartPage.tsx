import React from "react";
import { useCart } from "../context/CardContext";

const CartPage: React.FC = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();

  const handleIncreaseQty = async (itemId: string, currentQty: number) => {
    await updateCartItem(itemId, currentQty + 1);
  };

  const handleDecreaseQty = async (itemId: string, currentQty: number) => {
    if (currentQty > 1) {
      await updateCartItem(itemId, currentQty - 1);
    } else {
      await removeFromCart(itemId);
    }
  };

  if (!cart || cart.items.length === 0)
    return (
      
      <div className="bg-milk dark:bg-darkblack min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
        Your cart is empty.
      </div>
    );

  return (
    <div className="bg-milk dark:bg-darkblack min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Cart
      </h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100" alt={item.productId.productName} className="w-24 h-24 object-cover rounded" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{item.productId.productName}</p>
                <p className="text-primary font-bold">N{item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => handleDecreaseQty(item._id, item.quantity)}
                disabled={loading}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                –
              </button>
              <span className="font-medium">{item.quantity}</span>
              <button
                onClick={() => handleIncreaseQty(item._id, item.quantity)}
                disabled={loading}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end items-center gap-4 text-xl font-bold text-gray-900 dark:text-white">
        Total: N{cart.totalPrice.toFixed(2)}
      </div>
    </div>
    </div>
  );
};

export default CartPage;
