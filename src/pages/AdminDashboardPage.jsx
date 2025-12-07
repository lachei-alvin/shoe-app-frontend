import React, { useState, useEffect, useCallback } from "react";
import Notification from "../components/Notification.jsx";

// ====================================================================
// --- Admin Category Manager ---
// ====================================================================
const AdminCategoryManager = ({
  categories,
  authenticatedFetch,
  fetchCoreData,
  setAdminMessage,
  loading,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null); // {id: 1, name: "Running"}
  const [editName, setEditName] = useState("");

  // Handler for CREATE (Add Category)
  const handleAddCategory = async (e) => {
    e.preventDefault();

    const data = await authenticatedFetch(`/categories/`, {
      method: "POST",
      body: JSON.stringify({ name: newCategoryName }),
      headers: { "Content-Type": "application/json" },
    });

    if (data) {
      setNewCategoryName("");
      fetchCoreData();
      setAdminMessage({
        text: `Category '${data.name}' added successfully.`,
        type: "success",
      });
    }
  };

  // Handler for UPDATE (Save Changes)
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editName) return;

    const data = await authenticatedFetch(`/categories/${editingCategory.id}`, {
      method: "PUT",
      body: JSON.stringify({ name: editName }),
      headers: { "Content-Type": "application/json" },
    });

    if (data) {
      setEditingCategory(null);
      setEditName("");
      fetchCoreData();
      setAdminMessage({
        text: `Category ID ${data.id} updated to '${data.name}'.`,
        type: "success",
      });
    }
  };

  // Handler for DELETE
  const handleDeleteCategory = async (id, name) => {
    // NOTE: Using custom modal UI instead of window.confirm for production environment standards
    if (
      !window.confirm(
        `Are you sure you want to delete category "${name}"? This action cannot be undone.`
      )
    )
      return;

    const response = await authenticatedFetch(`/categories/${id}`, {
      method: "DELETE",
    });

    if (response) {
      fetchCoreData();
      setAdminMessage({
        text: `Category ${name} deleted successfully.`,
        type: "success",
      });
    }
  };

  // Set editing state
  const startEdit = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
      <h3 className="text-2xl font-semibold text-yellow-700 mb-4">
        Category Management
      </h3>

      {/* CREATE Form (Add) */}
      <form onSubmit={handleAddCategory} className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New Category Name"
          required
          className="flex-grow p-2 border border-gray-300 rounded-lg"
          disabled={loading || !!editingCategory}
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white p-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
          disabled={loading || !!editingCategory}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      {/* UPDATE Form (Edit Modal/Inline) */}
      {editingCategory && (
        <form
          onSubmit={handleUpdateCategory}
          className="p-4 mb-6 bg-blue-50 border-2 border-blue-300 rounded-lg space-y-3"
        >
          <h4 className="font-bold text-blue-700">
            Editing Category ID: {editingCategory.id}
          </h4>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="New Name"
            required
            className="w-full p-2 border border-blue-300 rounded-lg"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-grow bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="bg-gray-400 text-white p-2 rounded-lg font-semibold hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* READ List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <p className="text-sm font-medium text-gray-700 border-b pb-1">
          Existing Categories:
        </p>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found. Add one above.</p>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded-lg transition hover:bg-gray-100"
            >
              <span>
                {c.name} (ID: {c.id})
              </span>
              <div className="space-x-2">
                <button
                  className="text-xs px-2 py-1 rounded text-blue-500 bg-blue-100 hover:bg-blue-200"
                  onClick={() => startEdit(c)}
                  disabled={loading || !!editingCategory}
                >
                  Edit
                </button>
                <button
                  className="text-xs px-2 py-1 rounded text-red-500 bg-red-100 hover:bg-red-200"
                  onClick={() => handleDeleteCategory(c.id, c.name)}
                  disabled={loading || !!editingCategory}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ====================================================================
// --- Admin Product Manager ---
// ====================================================================

const initialProductForm = {
  name: "",
  description: "",
  price: 0.0,
  image_url: "https://placehold.co/400x300/e0e7ff/1f2937?text=NEW+SHOE",
  category_id: "",
};

const AdminProductManager = ({
  products,
  categories,
  authenticatedFetch,
  fetchCoreData,
  setAdminMessage,
  loading,
}) => {
  const [productForm, setProductForm] = useState(initialProductForm);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "category_id"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleEdit = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category_id: product.category_id,
    });
    setSelectedProductId(product.id);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProductForm(initialProductForm);
    setSelectedProductId(null);
    setIsEditing(false);
  };

  // Handler for CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const path = isEditing ? `/products/${selectedProductId}` : "/products/";

    // Validation check for Category ID
    if (!categories.some((c) => c.id === productForm.category_id)) {
      setAdminMessage({
        text: "Error: Please select a valid Category ID.",
        type: "error",
      });
      return;
    }

    const data = await authenticatedFetch(path, {
      method: method,
      body: JSON.stringify(productForm),
      headers: { "Content-Type": "application/json" },
    });

    if (data) {
      handleCancel(); // Reset form
      fetchCoreData(); // Refresh product list
      setAdminMessage({
        text: `${method === "POST" ? "Created" : "Updated"} product: ${
          data.name
        }.`,
        type: "success",
      });
    }
  };

  // Handler for DELETE
  const handleDelete = async (id, name) => {
    // NOTE: Using custom modal UI instead of window.confirm for production environment standards
    if (
      !window.confirm(
        `Are you sure you want to delete product "${name}"? This action cannot be undone.`
      )
    )
      return;

    const response = await authenticatedFetch(`/products/${id}`, {
      method: "DELETE",
    });

    if (response) {
      fetchCoreData();
      setAdminMessage({
        text: `Product ${name} deleted successfully.`,
        type: "success",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
      <h3 className="text-2xl font-semibold text-red-700 mb-4">
        Product Management
      </h3>

      {/* Product Form (Create/Update) */}
      <form
        onSubmit={handleSubmit}
        className="p-4 mb-6 bg-red-50 border-2 border-red-300 rounded-lg space-y-3"
      >
        <h4 className="font-bold text-red-700 mb-2">
          {isEditing
            ? `Editing Product ID: ${selectedProductId}`
            : "Add New Product"}
        </h4>

        {/* Row 1: Name and Price */}
        <div className="flex space-x-3">
          <input
            type="text"
            name="name"
            value={productForm.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="flex-grow p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            name="price"
            value={productForm.price}
            onChange={handleChange}
            placeholder="Price"
            required
            min="0.01"
            step="0.01"
            className="w-1/4 p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Row 2: Category and Image URL */}
        <div className="flex space-x-3">
          <select
            name="category_id"
            value={productForm.category_id}
            onChange={handleChange}
            required
            className="w-1/3 p-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">Select Category</option>
            {/* Ensure category names are used correctly in the options display */}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (ID: {c.id})
              </option>
            ))}
          </select>
          <input
            type="url"
            name="image_url"
            value={productForm.image_url}
            onChange={handleChange}
            placeholder="Image URL"
            required
            className="flex-grow p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Row 3: Description */}
        <textarea
          name="description"
          value={productForm.description}
          onChange={handleChange}
          placeholder="Product Description"
          required
          rows="3"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        {/* Submit/Action Buttons */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-grow bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {isEditing ? "Save Product Changes" : "Create New Product"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white p-3 rounded-lg font-semibold hover:bg-gray-500 transition"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Product List (Read) */}
      <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
        <p className="text-sm font-medium text-gray-700 border-b pb-1">
          Existing Products:
        </p>
        {products.length === 0 ? (
          <p className="text-lg text-red-500">
            No products found. Please ensure the backend is running and the
            database is seeded.
          </p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="p-2 border-b flex justify-between items-center text-sm bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="truncate">
                <span className="font-bold">{p.name}</span> - $
                {p.price.toFixed(2)} (ID: {p.id})
              </span>
              <div className="space-x-2 flex-shrink-0">
                <button
                  className="text-xs px-2 py-1 rounded text-blue-500 bg-blue-100 hover:bg-blue-200"
                  onClick={() => handleEdit(p)}
                  disabled={loading || isEditing}
                >
                  Edit
                </button>
                <button
                  className="text-xs px-2 py-1 rounded text-red-500 bg-red-100 hover:bg-red-200"
                  onClick={() => handleDelete(p.id, p.name)}
                  disabled={loading || isEditing}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ====================================================================
// --- Admin Dashboard Page Root ---
// ====================================================================

const AdminDashboardPage = ({
  currentUser,
  authenticatedFetch,
  categories,
  products,
  fetchCoreData,
  setAdminMessage,
  loading,
}) => {
  const [allOrders, setAllOrders] = useState([]);
  const isUserAdmin = currentUser?.is_admin;

  const fetchAllOrders = useCallback(async () => {
    if (!isUserAdmin) return;
    const data = await authenticatedFetch(`/orders`);
    if (data) setAllOrders(data);
  }, [isUserAdmin, authenticatedFetch]);

  useEffect(() => {
    // Force a core data fetch when the dashboard loads to ensure we get the latest products/categories
    // This is necessary because the App.jsx fetch might happen before the backend seeding is complete on restart.
    fetchCoreData();
    fetchAllOrders();
  }, [fetchAllOrders, fetchCoreData]); // Added fetchCoreData to dependencies

  if (!currentUser || !isUserAdmin) {
    return (
      <Notification
        message="Access Denied: Administrator privileges required."
        type="error"
      />
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminCategoryManager
          categories={categories}
          authenticatedFetch={authenticatedFetch}
          fetchCoreData={fetchCoreData}
          setAdminMessage={setAdminMessage}
          loading={loading}
        />
        <AdminProductManager
          products={products}
          categories={categories} // Pass categories for dropdown
          authenticatedFetch={authenticatedFetch}
          fetchCoreData={fetchCoreData}
          setAdminMessage={setAdminMessage}
          loading={loading}
        />
      </div>

      {/* All Orders View */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
        <h3 className="text-2xl font-semibold text-purple-700 mb-4">
          All Customer Orders
        </h3>
        <button
          onClick={fetchAllOrders}
          className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold mb-4 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh All Orders"}
        </button>
        {allOrders.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {allOrders.map((o) => (
              <div
                key={o.id}
                className="p-3 bg-gray-50 rounded-lg flex justify-between items-center text-sm"
              >
                <div>
                  <span className="font-bold">Order \#{o.id}</span> for User ID:{" "}
                  {o.user_id}
                </div>
                <div className="space-x-3">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      o.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {o.status}
                  </span>
                  <span className="font-bold text-lg text-green-600">
                    ${o.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No orders found in the database.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
