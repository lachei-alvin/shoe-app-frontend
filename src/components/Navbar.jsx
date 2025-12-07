import React from "react";

const Navbar = ({ currentUser, setView, handleLogout, VIEWS }) => {
  // Determine the user status text
  const statusText = currentUser
    ? `Logout (${currentUser.username})`
    : "Login / Register";

  return (
    <nav className="bg-indigo-600 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Home Button */}
        <h1
          className="text-2xl font-extrabold text-white cursor-pointer hover:text-indigo-200 transition"
          onClick={() => setView(VIEWS.SHOP)}
        >
          SHOE-APP
        </h1>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <button
            onClick={() => setView(VIEWS.SHOP)}
            className="text-white hover:text-indigo-200 transition font-medium"
          >
            Shop
          </button>

          {/* Cart Button (Visible only if a user is "logged in") */}
          {currentUser && (
            <button
              onClick={() => setView(VIEWS.CART)}
              className="text-white hover:text-indigo-200 transition font-medium"
            >
              Cart
            </button>
          )}

          {/* My Orders Button (Visible only if a user is "logged in") */}
          {currentUser && (
            <button
              onClick={() => setView(VIEWS.USER_ORDERS)}
              className="text-white hover:text-indigo-200 transition font-medium"
            >
              My Orders
            </button>
          )}

          {/* --- ADMIN DASHBOARD BUTTON (CRITICAL) --- */}
          {/* The button is ONLY visible if the current user object has is_admin: true */}
          {currentUser?.is_admin && (
            <button
              onClick={() => setView(VIEWS.ADMIN_DASHBOARD)}
              className="text-yellow-300 font-bold hover:text-yellow-100 transition"
            >
              Admin
            </button>
          )}

          {/* Login / Logout Button */}
          <button
            onClick={currentUser ? handleLogout : () => setView(VIEWS.AUTH)}
            className={`font-semibold transition ${
              currentUser
                ? "text-red-300 hover:text-red-100"
                : "text-white hover:text-indigo-200"
            }`}
          >
            {statusText}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
