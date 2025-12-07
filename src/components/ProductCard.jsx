import React from "react";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onAddToCart, isAuthenticated }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300 ease-in-out">
      <div className="relative h-48 bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x300/4f46e5/ffffff?text=SHOE"; // Tailwind Indigo-600 background
          }}
        />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-xl font-bold text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <p className="text-2xl font-extrabold text-indigo-600">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">
          Category ID: {product.category_id}
        </p>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={onAddToCart}
          disabled={!isAuthenticated}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={18} />
          <span>{isAuthenticated ? "Add to Cart" : "Login to Buy"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
