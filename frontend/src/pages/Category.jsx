import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Category() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

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

  useEffect(() => {
    setLoading(true);
    api.get(`/products?category=${name}`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [name]);

  const categoryDisplayName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 wavy-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb Navigation */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">{categoryDisplayName}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="relative text-center mb-16 overflow-hidden rounded-2xl shadow-lg">
          <div
            className="h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${categories.find(cat => cat.name === name)?.image || '/images/products/default.jpg'})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80"></div>
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                {categoryDisplayName}
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl drop-shadow-md">
                Explore our curated collection of {name.replace(/-/g, ' ')} products
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-gray-600">Loading products...</span>
            </div>
          </div>
        )}

        {/* Products Section */}
        {!loading && (
          <>
            {products.length > 0 ? (
              <>
                {/* Results Count */}
                <div className="flex justify-between items-center mb-8">
                  <p className="text-gray-700 font-medium">
                    {products.length} product{products.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="featured">Sort by: Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {sortedProducts.map(product => (
                    <div key={product._id} className="transform hover:scale-105 transition-transform duration-200">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="relative mx-auto mb-8 w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="relative w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-indigo-100">
                    <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products available</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  We're currently updating our inventory for this category. Check back soon for amazing new products!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Explore All Categories
                  </Link>
                  <Link
                    to="/deals"
                    className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Check Deals
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* Related Categories Section */}
        {!loading && products.length > 0 && (
          <div className="border-t border-gray-200 pt-12 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore More Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.filter(cat => cat.name !== name).slice(0, 11).map(category => (
                <Link
                  key={category.name}
                  to={`/category/${category.name}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-black overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.displayName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {category.displayName}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
