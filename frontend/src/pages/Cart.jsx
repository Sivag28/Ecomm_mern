import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, setCart } from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

export default function Cart() {
  const { items } = useSelector(s => s.cart);
  const user = useSelector(s => s.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get('/cart');
        const backendCartItems = (response.data || []).map(item => ({
          ...item.product,
          quantity: item.qty
        }));

        // Get localStorage cart items (deals products)
        const localCartItems = JSON.parse(localStorage.getItem('cart') || '[]');

        // Filter out deals products from backend items (they won't be in backend)
        const dealsProducts = localCartItems.filter(item => !/^[a-f\d]{24}$/i.test(item._id));

        // Merge backend items with deals products
        const mergedCart = [...backendCartItems, ...dealsProducts];

        dispatch(setCart(mergedCart));
      } catch (error) {
        console.error('Error fetching cart:', error);
        // If backend fetch fails, still load localStorage cart
        const localCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        dispatch(setCart(localCartItems));
      }
    };

    if (user) {
      fetchCart();
    } else {
      // If not logged in, load from localStorage
      const localCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      dispatch(setCart(localCartItems));
    }
  }, [user, dispatch]);

  const total = items.reduce((a, b) => a + (b.price * (b.quantity || 1)), 0);
  const totalItems = items.reduce((a, b) => a + (b.quantity || 1), 0);

  const handleRemoveFromCart = (item) => {
    Swal.fire({
      title: 'Remove Item?',
      text: `Are you sure you want to remove ${item.name} from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFromCart(item._id));
        Swal.fire(
          'Removed!',
          `${item.name} has been removed from your cart.`,
          'success'
        );
      }
    });
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.countInStock) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock Limit',
        text: `Only ${item.countInStock} items available in stock.`,
      });
      return;
    }
    dispatch(updateQuantity({ id: item._id, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to proceed with checkout.',
        confirmButtonText: 'Login'
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    if (items.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Your cart is empty. Add some products first.',
      });
      return;
    }

    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-12 text-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 min-h-screen wavy-bg">
        <div className="bg-white rounded-2xl shadow-lg p-12 border-2 border-black">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13H5.4m1.6 0h10M9 21a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-11xl mx-auto px-6 py-12 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 min-h-screen wavy-bg">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Your Cart ({totalItems} items)
        </h1>
        <p className="text-xl text-gray-600">Review your items and proceed to checkout</p>
      </div>

      <div className="flex justify-end mb-8">
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, index) => (
            <div key={`${item._id}-${index}`} className="bg-white rounded-2xl shadow-lg border-2 border-black overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Product Image */}
                <div className="sm:w-48 h-48 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600">by {item.brand}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Qty:</label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x border-gray-300">{item.quantity || 1}</span>
                          <button
                            onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">({item.countInStock} in stock)</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">₹{item.price * (item.quantity || 1)}</p>
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-black p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({totalItems})</span>
                <span className="font-medium">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{Math.round(total * 0.18)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-indigo-600">₹{total + Math.round(total * 0.18)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Proceed to Checkout
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure checkout powered by SSL encryption
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
