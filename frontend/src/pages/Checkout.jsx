import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../api/axios";
import { clearCart } from "../redux/cartSlice";

export default function Checkout() {
  const { items } = useSelector(s => s.cart);
  const user = useSelector(s => s.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const subtotal = items.reduce((a, b) => a + (b.price * (b.quantity || 1)), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city ||
        !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        products: items.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image
        })),
        totalAmount: total,
        shippingAddress,
        paymentMethod
      };

      const response = await api.post("/orders", orderData);

      if (response.data.order) {
        setOrderDetails({
          ...response.data.order,
          products: orderData.products,
          shippingAddress,
          paymentMethod,
          subtotal,
          shipping,
          tax,
          total
        });

        dispatch(clearCart());

        Swal.fire({
          title: 'Order Placed Successfully! 🎉',
          text: 'Your order has been confirmed and is being processed.',
          icon: 'success',
          confirmButtonText: 'View Invoice',
          showCancelButton: true,
          cancelButtonText: 'Continue Shopping'
        }).then((result) => {
          if (result.isConfirmed) {
            setShowInvoice(true);
          } else {
            navigate('/');
          }
        });
      }
    } catch (error) {
      console.error('Order placement error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: error.response?.data?.message || 'Failed to place order. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    Swal.fire({
      title: 'Want to add more products?',
      text: 'You can continue shopping and add more items to your cart.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, continue shopping',
      cancelButtonText: 'No, proceed to checkout'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/');
      } else {
        // Stay on checkout page
      }
    });
  };

  const downloadInvoice = async () => {
    const invoiceElement = document.querySelector('.invoice-container');
    if (!invoiceElement) return;

    try {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          // Skip elements with unsupported CSS
          return element.classList.contains('skip-pdf');
        },
        onclone: (clonedDoc) => {
          // Remove or replace unsupported styles in cloned document
          const elements = clonedDoc.querySelectorAll('*');
          elements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.backgroundImage && computedStyle.backgroundImage.includes('oklch')) {
              el.style.backgroundImage = 'none';
            }
            if (computedStyle.color && computedStyle.color.includes('oklch')) {
              el.style.color = '#000000';
            }
            if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
              el.style.backgroundColor = '#ffffff';
            }
            if (computedStyle.borderColor && computedStyle.borderColor.includes('oklch')) {
              el.style.borderColor = '#cccccc';
            }
            // Remove gradients and complex backgrounds
            if (computedStyle.background && computedStyle.background.includes('gradient')) {
              el.style.background = '#ffffff';
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${orderDetails._id || 'order'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to generate PDF. Please try again.',
      });
    }
  };

  if (showInvoice && orderDetails) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-black p-8 invoice-container">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Invoice</h1>
            <p className="text-gray-600">Order #{orderDetails._id ? orderDetails._id.slice(-8) : 'N/A'}</p>
            <p className="text-sm text-gray-500">Placed on {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderDetails.products.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{orderDetails.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{orderDetails.shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%):</span>
                <span>₹{orderDetails.tax}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{orderDetails.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="text-gray-700">
                <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                <p>{orderDetails.shippingAddress.address}</p>
                <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}</p>
                <p>{orderDetails.shippingAddress.phone}</p>
                <p>{orderDetails.shippingAddress.email}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <p className="text-gray-700 capitalize">{orderDetails.paymentMethod}</p>
              <p className={`text-sm ${orderDetails.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
               Order Status: {orderDetails.isPaid ? 'Completed' : 'Order Placed'}
              </p>
            </div>
          </div>

          <div className="text-center flex gap-4 justify-center">
            <button
              onClick={downloadInvoice}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              📄 Download Invoice
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-black p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Items to Checkout</h2>
          <p className="text-gray-600 mb-8">Your cart is empty. Add some products first.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-11xl mx-auto px-6 py-12 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 min-h-screen wavy-bg">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <button
          onClick={handleContinueShopping}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-black p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div key={item._id || `item-${index}`} className="flex items-center gap-4 border-b pb-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * (item.quantity || 1)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%):</span>
                <span>₹{tax}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-indigo-600">₹{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Form */}
        <div className="space-y-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-black p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-black p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <span className="font-medium">Cash on Delivery</span>
                  <p className="text-sm text-gray-600">Pay when you receive your order</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <span className="font-medium">Online Payment</span>
                  <p className="text-sm text-gray-600">Pay securely with card/UPI</p>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing Order...
              </>
            ) : (
              <>
                <span>💳</span>
                Place Order - ₹{total}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
