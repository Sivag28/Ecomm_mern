import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { addToCart } from "../redux/cartSlice";

export default function Home() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const categories = [
    { name: 'home-living', displayName: 'Home & Living', image: '/images/products/home-living.jpg' },
    { name: 'jewelry-accessories', displayName: 'Jewelry & Accessories', image: '/images/products/jewelry-accessories.jpg' },
    { name: 'clothing-wearables', displayName: 'Clothing & Wearables', image: '/images/products/clothing-wearables.jpg' },
    { name: 'bags-purses', displayName: 'Bags & Purses', image: '/images/products/bags-purses.jpg' },
    { name: 'art-collectibles', displayName: 'Art & Collectibles', image: '/images/products/art-collectibles.jpg' },
    { name: 'stationery-party', displayName: 'Stationery & Party Supplies', image: '/images/products/stationery-party.jpg' },
    { name: 'bath-beauty', displayName: 'Bath & Beauty', image: '/images/products/bath-beauty.jpg' },
    { name: 'toys-games', displayName: 'Toys & Games', image: '/images/products/toys-games.jpg' },
    { name: 'weddings-events', displayName: 'Weddings & Events', image: '/images/products/weddings-events.jpg' },
    { name: 'pet-supplies', displayName: 'Pet Supplies', image: '/images/products/pet-supplies.jpg' },
    { name: 'seasonal-holiday', displayName: 'Seasonal & Holiday Items', image: '/images/products/seasonal-holiday.jpg' },
    { name: 'craft-supplies', displayName: 'Craft Supplies & Tools', image: '/images/products/craft-supplies.jpg' }
  ];



  return (
    <>
      {/* USER PROFILE */}
      {user && (
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white/50 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-black">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome back, {user.name}!</h2>

            </div>
          </div>
        </section>
      )}

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24 text-center overflow-hidden wavy-bg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-3xl"></div>
        <div className="absolute inset-0 wavy-bg opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg">
            Shop Smarter. Live Better.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-md">
            Discover amazing deals across 12+ categories
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/deals"
              className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl hover:bg-pink/30 transition-all duration-300 font-bold text-lg shadow-lg border border-black/20 hover:shadow-xl transform hover:scale-105"
            >
              🔥 View Deals
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-11xl mx-auto px-6 py-12 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 min-h-screen wavy-bg">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Shop by Category
          </h1>
          <p className="text-xl text-gray-600">Explore our amazing collection of handmade products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map(category => (
            <div key={category.name} className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 border-black">
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={category.image}
                  alt={category.displayName}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xl font-bold drop-shadow-lg">{category.displayName}</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">{category.displayName}</h3>
                <Link
                  to={`/category/${category.name}`}
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Shop Now
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
