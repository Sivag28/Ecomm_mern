import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import api from "../api/axios";
import { addToCart } from "../redux/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(s => s.user.user);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isDeal, setIsDeal] = useState(false);
  const [dealProduct, setDealProduct] = useState(null);

  useEffect(() => {
    // Check if this is a deal product from location state
    if (location.state && location.state.isDeal && location.state.dealProduct) {
      setIsDeal(true);
      setDealProduct(location.state.dealProduct);
      setProduct(location.state.dealProduct);
      setLoading(false);
    } else {
      // Regular product fetch - only if id is a valid ObjectId (24 characters)
      if (id && id.length === 24) {
        api.get(`/products/${id}`)
          .then(res => {
            setProduct(res.data);
            setLoading(false);
          })
          .catch(err => {
            setError("Product not found");
            setLoading(false);
          });
      } else {
        setError("Invalid product ID");
        setLoading(false);
      }
    }
  }, [id, location.state]);

  const handleAddToCart = () => {
    const productWithQuantity = { ...product, quantity };
    dispatch(addToCart(productWithQuantity));
    Swal.fire({
      title: 'Added to Cart!',
      text: `${quantity} ${product.name}(s) added to your cart.`,
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

  const handleBuyNow = (product, quantity) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to proceed with purchase.',
        confirmButtonText: 'Login',
        position: 'center'
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    // Add to cart and navigate to checkout
    const productWithQuantity = { ...product, quantity };
    dispatch(addToCart(productWithQuantity));

    Swal.fire({
      title: 'Proceeding to Checkout',
      text: `Taking you to checkout for ${quantity} ${product.name}(s)...`,
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
      background: 'rgba(255, 255, 255, 0.95)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      position: 'center',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-2xl font-bold text-gray-800',
        content: 'text-lg text-gray-600'
      }
    }).then(() => {
      navigate('/checkout');
    });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 min-h-screen wavy-bg">
      {/* Product Image with Glassmorphism */}
      <div className="w-full mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl opacity-20 blur-xl"></div>
        <img
          src={product.image}
          alt={product.name}
          className="relative w-full h-96 md:h-[600px] object-cover rounded-3xl shadow-2xl border-4 border-black backdrop-blur-sm"
        />
      </div>

      {/* Product Details - Vertical Layout with Enhanced Styling */}
      <div className="space-y-8">
        {/* Name and Brand with Glassmorphism */}
        <div className="text-center bg-white/30 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-black">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{product.name}</h1>
          <p className="text-xl text-gray-700 font-medium">by {product.brand}</p>
        </div>

        {/* Price and Rating with Glassmorphism */}
        <div className="flex flex-col items-center space-y-4 bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-lg  border border-black">
          <div className="flex items-center space-x-2">
            <span className="text-5xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">₹{isDeal ? dealProduct.dealPrice : product.price}</span>
            {isDeal && <span className="text-2xl text-gray-500 line-through">₹{dealProduct.originalPrice}</span>}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-2xl ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <span className="text-lg text-gray-700">{product.rating} ({product.numReviews} reviews)</span>
          </div>
        </div>

        {/* Description with Glassmorphism */}
        <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-black">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Description</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
        </div>

        {/* Category and Stock with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-black">
            <span className="font-semibold text-blue-800">Category:</span>
            <span className="ml-2 text-blue-600 capitalize">{product.category.replace('-', ' ')}</span>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-green-200 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-black">
            <span className="font-semibold text-green-800">In Stock:</span>
            <span className="ml-2 text-green-600">{product.countInStock} items</span>
          </div>
        </div>

        {/* Quantity Selector with Glassmorphism */}
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-black">
          <label className="block text-lg font-medium text-gray-700 mb-4">
            Quantity
          </label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border border-gray-300/50 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
          >
            {[...Array(Math.min(10, product.countInStock))].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Add to Cart and Buy Now Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold text-xl shadow-2xl transform hover:scale-105 hover:shadow-3xl border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
          >
            🛒 Add to Cart - ₹{isDeal ? dealProduct.dealPrice * quantity : product.price * quantity}
          </button>

          <button
            onClick={() => handleBuyNow(product, quantity)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-bold text-xl shadow-2xl transform hover:scale-105 hover:shadow-3xl border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
          >
            ⚡ Buy Now - ₹{isDeal ? dealProduct.dealPrice * quantity : product.price * quantity}
          </button>
        </div>

        {/* Additional Product Info with Glassmorphism */}
        <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl  border border-black">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Product Details</h2>
          <div className="space-y-4 text-lg">
            <div className="flex justify-between items-center py-2 border-b border-black-200/50">
              <span className="font-medium text-gray-600">Brand:</span>
              <span className="text-gray-800">{product.brand}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-black-200/50">
              <span className="font-medium text-gray-600">Price:</span>
              <span className="text-gray-800">
                {isDeal ? (
                  <>
                    ₹{dealProduct.dealPrice} <span className="text-gray-500 line-through">₹{dealProduct.originalPrice}</span>
                  </>
                ) : (
                  <>₹{product.price}</>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-black-200/50">
              <span className="font-medium text-gray-600">Rating:</span>
              <span className="text-gray-800">{product.rating}/5</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-black-200/50">
              <span className="font-medium text-gray-600">Number of Reviews:</span>
              <span className="text-gray-800">{product.numReviews}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-black-200/50">
              <span className="font-medium text-gray-600">Category:</span>
              <span className="text-gray-800 capitalize">{product.category.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-600">Stock Available:</span>
              <span className="text-gray-800">{product.countInStock}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
