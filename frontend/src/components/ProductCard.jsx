import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCartAsync } from "../redux/cartSlice";
import { toggleWishlistAsync } from "../redux/wishlistSlice";
import Swal from 'sweetalert2';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleWishlistToggle = () => {
    dispatch(toggleWishlistAsync(product));
    Swal.fire({
      title: 'Wishlist Updated!',
      text: 'Product has been added to your wishlist ❤️',
      icon: 'success',
      confirmButtonText: 'Continue Shopping',
      confirmButtonColor: '#3B82F6',
      background: 'rgba(255, 255, 255, 0.95)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      position: 'center',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-2xl font-bold text-gray-800',
        content: 'text-lg text-gray-600'
      }
    });
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-black overflow-hidden">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Wishlist Button Overlay */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
        >
          ❤️
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-indigo-600">₹{product.price}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/product/${product._id}`)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
          >
            👁️ View Details
          </button>

          <button
            onClick={() => {
              dispatch(addToCartAsync(product));
              Swal.fire({
                title: 'Added to Cart!',
                text: `${product.name} has been added to your cart 🛒`,
                icon: 'success',
                confirmButtonText: 'Continue Shopping',
                confirmButtonColor: '#3B82F6',
                background: 'rgba(255, 255, 255, 0.95)',
                backdrop: 'rgba(0, 0, 0, 0.4)',
                position: 'center',
                customClass: {
                  popup: 'rounded-2xl shadow-2xl',
                  title: 'text-2xl font-bold text-gray-800',
                  content: 'text-lg text-gray-600'
                }
              });
            }}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
