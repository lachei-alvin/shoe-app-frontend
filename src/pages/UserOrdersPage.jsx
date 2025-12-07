import React, { useState, useEffect, useCallback } from "react";
import Notification from "../components/Notification.jsx"; // FIX: Added .jsx extension

const UserOrdersPage = ({ currentUser, authenticatedFetch, loading }) => {
  const [myOrders, setMyOrders] = useState([]);
  const userId = currentUser?.id;

  const fetchMyOrders = useCallback(async () => {
    if (!userId) return;
    const data = await authenticatedFetch(`/orders/user/${userId}`);
    if (data) setMyOrders(data);
  }, [userId, authenticatedFetch]);

  useEffect(() => {
    // Fetch orders when the component mounts or the user changes
    if (currentUser) {
      fetchMyOrders();
    }
  }, [currentUser, fetchMyOrders]);

  if (!currentUser) {
    return (
      <Notification message="Please log in to view your orders." type="error" />
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">
        My Orders (Req 7: View Details)
      </h2>

      <button
        onClick={fetchMyOrders}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold mb-4 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh My Order History"}
      </button>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-3">
          Order History for {currentUser.username}
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading order history...</p>
        ) : myOrders.length > 0 ? (
          <div className="text-sm text-gray-600 space-y-2 max-h-96 overflow-y-auto">
            {myOrders.map((o) => (
              <div
                key={o.id}
                className="p-3 border-b border-gray-100 bg-gray-50 rounded-lg flex justify-between items-center transition hover:bg-gray-100"
              >
                <div>
                  <span className="font-bold text-gray-800">
                    Order \#{o.id}
                  </span>
                  <span className="ml-4 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    {o.status}
                  </span>
                  <span className="ml-4 text-xs text-gray-500">
                    Placed: {new Date(o.order_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="font-bold text-xl text-green-600">
                  ${o.total_amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't placed any orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;
