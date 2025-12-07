import React, { useMemo } from "react";
import ProductCard from "../components/ProductCard.jsx";

const ShopPage = ({
  products,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  authenticatedFetch,
  currentUser,
  loading,
  setAdminMessage,
}) => {
  // Handler for Add to Cart
  const handleAddToCart = async (product_id) => {
    if (!currentUser)
      return setAdminMessage({
        text: "Please log in to add items to your cart.",
        type: "error",
      });

    const cartItemData = {
      product_id: product_id,
      quantity: 1,
    };

    const data = await authenticatedFetch(`/cart/add`, {
      method: "POST",
      body: JSON.stringify(cartItemData),
      headers: { "Content-Type": "application/json" },
    });

    if (data) {
      setAdminMessage({
        text: `Added product ${product_id} to cart! (Current quantity: ${data.quantity})`,
        type: "success",
      });
    }
  };

  // Filter products by category ID
  const displayedProducts = useMemo(() => {
    return selectedCategoryId
      ? products.filter((p) => p.category_id === selectedCategoryId)
      : products;
  }, [products, selectedCategoryId]);

  // Use a unique key for the main seeded category ("Running") for predictable filter buttons
  const runningCategory = categories.find((c) => c.name === "Running");

  return (
    <div className="space-y-8">
      {/* --- DEBUGGING BANNER REMOVED --- 
            <div className="p-2 text-sm bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
                <span className="font-bold">DEBUG:</span> Products Received: {products.length} | Categories Received: {categories.length}
            </div>
            --- END DEBUGGING BANNER REMOVED --- */}

      <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">
        Our Latest Collection
      </h2>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 items-center p-3 bg-white rounded-xl shadow-md">
        <span className="font-semibold text-gray-700">Filter By:</span>
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-2 rounded-full font-semibold transition text-sm ${
            selectedCategoryId === null
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All ({products.length})
        </button>
        {/* Dynamically generated filter buttons */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-2 rounded-full font-semibold transition text-sm ${
              selectedCategoryId === cat.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && products.length === 0 ? (
          <p className="text-lg text-gray-500 col-span-full">
            Loading products...
          </p>
        ) : displayedProducts.length === 0 ? (
          <p className="text-lg text-gray-500 col-span-full">
            No products found in this selection. (Check backend data/logs)
          </p>
        ) : (
          displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product.id)}
              isAuthenticated={!!currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ShopPage;
