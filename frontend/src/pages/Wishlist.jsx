import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist, setWishlist } from "../redux/wishlistSlice";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";
import Swal from 'sweetalert2';

export default function Wishlist() {
  const { items } = useSelector(s => s.wishlist);
  const { user } = useSelector(s => s.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get('/wishlist');
        dispatch(setWishlist(response.data.products || []));
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user, dispatch]);

  return (
    <section className="max-w-11xl mx-auto px-6 py-12 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 min-h-screen wavy-bg">
 

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="max-w-md text-center py-16 px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Your Wishlist
            </h2>
            <p className="text-xl text-gray-600 mb-8">Your saved items for later</p>
            <p className="text-2xl text-gray-500 italic mb-6 flex items-center justify-center gap-3">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Your wishlist is empty.....
            </p>
            <p className="text-sm text-gray-500">Add items by clicking the bookmark icon on product cards</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(p => (
            <div key={p._id} className="relative">
              <ProductCard product={p} />
              <button
                onClick={() => {
                  dispatch(removeFromWishlist(p._id));
                  Swal.fire({
                        title: 'Removed from Wishlist!',
                        text: 'Product has been removed from your wishlist 💔',
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
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
