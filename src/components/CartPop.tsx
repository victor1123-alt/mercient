import React from "react";
import { useCart } from "../context/CardContext";
import { motion, AnimatePresence } from "framer-motion";

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose, onCheckout }) => {
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide-in Cart Panel */}
          <motion.div
            className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-2xl z-50 p-5 overflow-y-auto flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Your Cart</h2>

            {!cart || cart.items.length === 0 ? (
              <p className="text-gray-600 text-center mt-20">Your cart is empty.</p>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between border-b pb-2">
                      <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100" alt={item.productId.productName} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 ml-3">
                        <h3 className="font-medium">{item.productId.productName}</h3>
                        <p className="text-gray-500">N{item.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => handleDecreaseQty(item._id, item.quantity)}
                            disabled={loading}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => handleIncreaseQty(item._id, item.quantity)}
                            disabled={loading}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total:</span>
                    <span>N{cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={onCheckout}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPopup;
