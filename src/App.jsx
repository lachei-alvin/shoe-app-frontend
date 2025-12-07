import React, { useState, useEffect, useCallback } from "react";
// Using explicit relative paths and file extensions
import Navbar from "./components/Navbar.jsx";
import Notification from "./components/Notification.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import UserOrdersPage from "./pages/UserOrdersPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { fetchData, authenticatedFetch, checkApiHealth } from "./utils/api.js";

// --- CONFIGURATION ---
const VIEWS = {
  SHOP: "SHOP",
  AUTH: "AUTH",
  USER_ORDERS: "USER_ORDERS",
  ADMIN_DASHBOARD: "ADMIN_DASHBOARD",
  CART: "CART",
};

const App = () => {
  const [view, setView] = useState(VIEWS.SHOP);
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState({ text: "", type: "" });
  const [isApiHealthy, setIsApiHealthy] = useState(true);

  // --- Core Data Fetching (Public) ---
  const fetchCoreData = useCallback(async () => {
    setLoading(true);
    const [catData, prodData] = await Promise.all([
      fetchData(`/categories`),
      fetchData(`/products`),
    ]);
    if (catData) setCategories(catData);
    if (prodData) setProducts(prodData);
    setLoading(false);
  }, []);

  // --- User Fetcher (Fetches mock user) ---
  const fetchUser = useCallback(async (memoizedAuthenticatedFetch) => {
    // Mock authentication: attempt to fetch the mock user immediately.
    // If the backend is seeded, this should succeed on load.
    const user = await memoizedAuthenticatedFetch("/users/me", {
      method: "GET",
    });
    if (user) {
      setCurrentUser(user);
      return user;
    } else {
      setCurrentUser(null);
      return null;
    }
  }, []);

  // --- Memoized Authenticated Fetcher (Mocked) ---
  const memoizedAuthenticatedFetch = useCallback(async (path, options = {}) => {
    setLoading(true);
    const data = await authenticatedFetch(path, "MOCK_TOKEN", options);
    setLoading(false);
    return data;
  }, []);

  // --- Initialization Effect (Health Check + User/Data Fetch) ---
  useEffect(() => {
    const runInitialization = async () => {
      const health = await checkApiHealth();
      if (!health) {
        setIsApiHealthy(false);
        setAdminMessage({
          text: "API connection failed. Please ensure the FastAPI backend is running on http://127.0.0.1:8000.",
          type: "error",
        });
        return;
      }
      setIsApiHealthy(true);

      // 1. Fetch Core Data
      fetchCoreData();

      // 2. Fetch Mock User on start
      const user = await fetchUser(memoizedAuthenticatedFetch);

      if (!user) {
        // If fetching the MockUser failed on startup, it means the token or me endpoint is failing.
        setAdminMessage({
          text: "Initial user fetch failed. Check backend logs for /users/me or mock user creation error.",
          type: "error",
        });
      }
    };

    runInitialization();
  }, [fetchCoreData, fetchUser, memoizedAuthenticatedFetch]);

  // --- Authentication Handlers (Simplified) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // MOCK LOGIN: Hit the mock token endpoint
    const data = await fetchData(`/token`, {
      method: "POST",
      // No credentials needed, but we send the form structure to match the original API spec.
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: e.target.username.value,
        password: e.target.password.value,
      }).toString(),
    });

    if (data && data.access_token) {
      // Success: Re-fetch the mock user object to confirm login state
      const user = await fetchUser(memoizedAuthenticatedFetch);
      if (user) {
        setAdminMessage({
          text: `Welcome, ${user.username}! (Mock Login)`,
          type: "success",
        });
        setView(VIEWS.SHOP);
      }
    } else if (data === null) {
      setAdminMessage({
        text: "Login failed due to network error, or the backend /token endpoint failed.",
        type: "error",
      });
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const data = await fetchData(`/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (data) {
      setAdminMessage({
        text: `User ${data.username} registered successfully! Please log in.`,
        type: "success",
      });
      setView(VIEWS.AUTH);
    } else if (data === null) {
      setAdminMessage({
        text: "Registration failed due to a network or unexpected API error. Check the console for details.",
        type: "error",
      });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAdminMessage({ text: "Logged out successfully.", type: "info" });
    setView(VIEWS.SHOP);
  };

  // --- Main Renderer (Routing Logic) ---
  const renderCurrentView = () => {
    if (!isApiHealthy) {
      return (
        <div className="text-center p-10 bg-red-50 rounded-lg shadow-inner mt-10">
          <h3 className="text-3xl font-bold text-red-700 mb-4">
            Backend Connection Failed
          </h3>
          <p className="text-lg text-gray-700">
            The application cannot connect to the API server.
          </p>
          <p className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <span className="font-semibold block">Action Required:</span>
            Please ensure your FastAPI server is running on{" "}
            <code className="font-mono text-sm">http://127.0.0.1:8000</code>.
          </p>
        </div>
      );
    }

    switch (view) {
      case VIEWS.AUTH:
        return (
          <AuthPage
            handleRegister={handleRegister}
            handleLogin={handleLogin}
            loading={loading}
          />
        );
      case VIEWS.ADMIN_DASHBOARD:
        return (
          <AdminDashboardPage
            currentUser={currentUser}
            authenticatedFetch={memoizedAuthenticatedFetch}
            categories={categories}
            products={products}
            fetchCoreData={fetchCoreData}
            setAdminMessage={setAdminMessage}
            loading={loading}
          />
        );
      case VIEWS.USER_ORDERS:
        return (
          <UserOrdersPage
            currentUser={currentUser}
            authenticatedFetch={memoizedAuthenticatedFetch}
            loading={loading}
          />
        );
      case VIEWS.CART:
        return (
          <CartPage
            currentUser={currentUser}
            authenticatedFetch={memoizedAuthenticatedFetch}
            setAdminMessage={setAdminMessage}
            loading={loading}
          />
        );
      case VIEWS.SHOP:
      default:
        return (
          <ShopPage
            products={products}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            currentUser={currentUser}
            authenticatedFetch={memoizedAuthenticatedFetch}
            setAdminMessage={setAdminMessage}
            loading={loading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar
        currentUser={currentUser}
        setView={setView}
        handleLogout={handleLogout}
        VIEWS={VIEWS}
      />

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Notification
          message={adminMessage.text}
          type={adminMessage.type}
          onClose={() => setAdminMessage({ text: "", type: "" })}
        />
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default App;
