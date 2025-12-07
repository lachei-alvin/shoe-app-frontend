import React, { useState, useEffect, useCallback } from "react";
import Notification from "../components/Notification.jsx";

const CartPage = ({
  currentUser,
  authenticatedFetch,
  loading,
  setAdminMessage,
}) => {
  const [cartItems, setCartItems] = useState([]);
  const userId = currentUser?.id;

  const fetchCart = useCallback(async () => {
    if (!userId) return;

    const data = await authenticatedFetch(`/cart/${userId}`);
    if (data) setCartItems(data);
  }, [userId, authenticatedFetch]);

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [currentUser, fetchCart]);

  // Handler for Checkout process
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setAdminMessage({ text: "Your cart is empty!", type: "info" });
      return;
    }

    const order = await authenticatedFetch(`/orders/create`, {
      method: "POST",
      // No body needed; calculation is done on the backend
    });

    if (order) {
      // Success: Clear cart display, show success message
      setCartItems([]);
      setAdminMessage({
        text: `Order #${
          order.id
        } placed successfully! Total: $${order.total_amount.toFixed(2)}.`,
        type: "success",
      });
    }
  };

  if (!currentUser) {
    return (
      <Notification
        message="Please log in to view your shopping cart."
        type="error"
      />
    );
  }

  // NOTE: This client-side total is a mock placeholder. The real total is calculated on the backend.
  const total = cartItems.reduce((sum, item) => {
    // Mock price is $10 per item for display purposes, but backend uses real product prices
    return sum + item.quantity * 10;
  }, 0);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">
        Your Shopping Cart
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-3 border-b pb-2">
          Items ({cartItems.length})
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading cart...</p>
        ) : cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border"
              >
                <div>
                  <span className="font-bold text-gray-800">
                    Product ID: {item.product_id}
                  </span>
                  <span className="ml-4 text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </span>
                </div>
                {/* Mock price display */}
                <div className="font-bold text-lg text-indigo-600">
                  ${(item.quantity * 10).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-500 text-center py-4">
            Your cart is currently empty. Start shopping!
          </p>
        )}
      </div>

      {/* Checkout Summary */}
      <div className="flex justify-end">
        <div className="w-full md:w-1/3 p-6 bg-white rounded-xl shadow-2xl border-t-4 border-indigo-500">
          <p className="text-xl font-semibold flex justify-between mb-4">
            Subtotal (Mock Est.):{" "}
            <span className="text-2xl font-extrabold text-indigo-700">
              ${total.toFixed(2)}
            </span>
          </p>
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
            disabled={cartItems.length === 0 || loading}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
