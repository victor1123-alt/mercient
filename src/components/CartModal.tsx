import React from "react";
import { useCart } from "../context/CardContext";

interface CartModalProps {
  onClose: () => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose, onCheckout }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-[100]">
      <div className="bg-white dark:bg-gray-900 w-[90%] max-w-md rounded-xl shadow-2xl p-5 relative animate-slideDown">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-primary text-lg"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Your Cart
        </h2>

        {!cart || cart.items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100" // Placeholder
                  alt={item.productId.productName}
                  className="w-14 h-14 rounded-md object-cover"
                />
                <div className="flex-1 px-3">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.productId.productName}
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    N{item.price}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleDecreaseQty(item._id, item.quantity)}
                      disabled={loading}
                      className="px-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQty(item._id, item.quantity)}
                      disabled={loading}
                      className="px-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total + Checkout */}
        {cart && cart.items.length > 0 && (
          <div className="mt-5 border-t pt-3">
            <p className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
              Total: N{cart.totalPrice.toLocaleString()}
            </p>
            <button
              onClick={onCheckout}
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
