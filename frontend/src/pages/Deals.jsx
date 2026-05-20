import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addToCartAsync } from "../redux/cartSlice";

export default function Deals() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Deals products with discounted prices
  const dealsProducts = [
    {
      _id: 'deal-1',
      id: 1,
      name: 'Pillows',
      price: 19, // Use deal price as main price
      originalPrice: 29,
      dealPrice: 19,
      image: '/images/products/pillows.jpg',
      brand: 'HomeCo',
      category: 'home-living',
      rating: 4.5,
      numReviews: 42,
      countInStock: 120,
      description: 'Soft and comfortable pillows made from premium materials. Perfect for a good night\'s sleep and adding comfort to your home decor.'
    },
    {
      _id: 'deal-2',
      id: 2,
      name: 'Necklaces',
      price: 29, // Use deal price as main price
      originalPrice: 45,
      dealPrice: 29,
      image: '/images/products/necklaces.jpg',
      brand: 'Bijou',
      category: 'jewelry-accessories',
      rating: 4.7,
      numReviews: 64,
      countInStock: 70,
      description: 'Elegant handcrafted necklaces made with genuine materials. Perfect for special occasions or everyday wear.'
    },
    {
      _id: 'deal-3',
      id: 3,
      name: 'Hats',
      price: 15, // Use deal price as main price
      originalPrice: 25,
      dealPrice: 15,
      image: '/images/products/hats.jpg',
      brand: 'HeadStart',
      category: 'clothing-wearables',
      rating: 4.3,
      numReviews: 30,
      countInStock: 110,
      description: 'Stylish and comfortable hats perfect for outdoor activities or casual wear. Made with high-quality materials.'
    },
    {
      _id: 'deal-4',
      id: 4,
      name: 'Leather Bags',
      price: 89, // Use deal price as main price
      originalPrice: 120,
      dealPrice: 89,
      image: '/images/products/leather-bags.jpg',
      brand: 'LeatherWorks',
      category: 'bags-purses',
      rating: 4.7,
      numReviews: 29,
      countInStock: 34,
      description: 'Premium leather bags crafted with attention to detail. Durable, stylish, and perfect for everyday use.'
    },
    {
      _id: 'deal-5',
      id: 5,
      name: 'Paintings',
      price: 129, // Use deal price as main price
      originalPrice: 180,
      dealPrice: 129,
      image: '/images/products/paintings.jpg',
      brand: 'Artisan',
      category: 'art-collectibles',
      rating: 4.8,
      numReviews: 9,
      countInStock: 12,
      description: 'Beautiful hand-painted artworks that add character and elegance to any space. Each piece is unique and crafted by skilled artists.'
    },
    {
      _id: 'deal-6',
      id: 6,
      name: 'Handmade Soaps',
      price: 5, // Use deal price as main price
      originalPrice: 8,
      dealPrice: 5,
      image: '/images/products/handmade-soaps.jpg',
      brand: 'Pure',
      category: 'bath-beauty',
      rating: 4.6,
      numReviews: 72,
      countInStock: 220,
      description: 'Natural handmade soaps made with essential oils and organic ingredients. Gentle on skin and perfect for daily use.'
    }
  ];

  const handleAddToCart = (product) => {
    const productWithQuantity = { ...product, _id: product.id, quantity: 1, price: product.dealPrice };
    dispatch(addToCartAsync(productWithQuantity));
    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.name} added to your cart at deal price ₹${product.dealPrice}.`,
      icon: 'success',
      confirmButtonText: 'Continue Shopping',
      confirmButtonColor: '#3B82F6',
      background: 'rgba(255, 255, 255, 0.95)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-2xl font-bold text-gray-800',
        content: 'text-lg text-gray-600'
      }
    });
  };

  return (
    <section className="max-w-11xl mx-auto px-6 py-12 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 min-h-screen wavy-bg">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Flash Deals
        </h1>
        <p className="text-xl text-gray-600">Limited time offers - Save big on premium products!</p>
      </div>
      {/* Call to Action */}
      <div className="text-center mt-16 mb-20">
        <div className="bg-white/60 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl border-2 border-white/40 max-w-4xl mx-auto relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-red-400/20 animate-pulse"></div>

          {/* Floating particles effect - Hidden on mobile for better performance */}
          <div className="hidden md:block absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
          <div className="hidden md:block absolute top-8 right-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
          <div className="hidden md:block absolute bottom-6 left-8 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
          <div className="hidden md:block absolute bottom-4 right-4 w-2 h-2 bg-red-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1.5s'}}></div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              🚨 Don't Miss Out! 🚨
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 font-medium px-4 md:px-0">
              These deals are for a limited time. Shop now and save big on premium handmade products!
            </p>

            {/* Enhanced Countdown Timer */}
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 p-4 md:p-8 rounded-2xl text-white mb-6 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
                <span className="text-2xl md:text-3xl animate-bounce">⏰</span>
                <h3 className="text-lg md:text-xl font-bold">Deal Ends In:</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center border border-white/30">
                  <div className="text-2xl md:text-3xl font-bold animate-pulse">{timeLeft.days.toString().padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm opacity-90 font-medium">Days</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center border border-white/30">
                  <div className="text-2xl md:text-3xl font-bold animate-pulse">{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm opacity-90 font-medium">Hours</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center border border-white/30">
                  <div className="text-2xl md:text-3xl font-bold animate-pulse">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm opacity-90 font-medium">Minutes</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center border border-white/30">
                  <div className="text-2xl md:text-3xl font-bold animate-pulse">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm opacity-90 font-medium">Seconds</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 md:px-0">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                🛒 Shop Now - Save Big!
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                📦 View All Deals
              </button>
            </div>

            {/* Urgency Message */}
            <div className="mt-4 md:mt-6 text-xs md:text-sm text-gray-600 font-medium px-4 md:px-0">
              <span className="inline-block bg-red-100 text-red-800 px-2 md:px-3 py-1 rounded-full border border-red-200">
                ⚡ Limited Stock Available - Act Fast!
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {dealsProducts.map(product => (
          <div key={product.id} className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border-2 border-black overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            {/* Deal Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {Math.round(((product.originalPrice - product.dealPrice) / product.originalPrice) * 100)}% OFF
              </span>
            </div>

            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Product Details */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">by {product.brand}</p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">({product.numReviews})</span>
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">₹{product.dealPrice}</span>
                  <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                </div>
                <span className="text-sm text-green-600 font-semibold">
                  Save ₹{product.originalPrice - product.dealPrice}
                </span>
              </div>

              {/* Stock Status */}
              <div className="text-sm text-gray-600 mb-4">
                {product.countInStock > 0 ? (
                  <span className="text-green-600">✓ In Stock ({product.countInStock} left)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>

              {/* View Details Button */}
              <button
                onClick={() => navigate(`/product/${product.id}`, {
                  state: {
                    dealProduct: product,
                    isDeal: true
                  }
                })}
                className="w-full mb-3 bg-gradient-to-r from-blue-500 via-blue-500 to-green-500 bg-white/80 backdrop-blur-md text-gray-800 py-3 px-6 rounded-2xl hover:bg-white/90 transition-all duration-300 font-bold text-lg shadow-lg border border-gray-200/50 transform hover:scale-105"
              >
                👁️ View Details
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.countInStock === 0}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {product.countInStock > 0 ? 'Add to Cart - ₹' + product.dealPrice : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}
