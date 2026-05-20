import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewData, setReviewData] = useState({ productId: '', rating: 5, comment: '' });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

  const openReviewModal = (productId) => {
    setReviewData({ productId, rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      await api.post(`/products/${reviewData.productId}/reviews`, {
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      // Add product to reviewed set
      setReviewedProducts(prev => new Set([...prev, reviewData.productId]));
      Swal.fire({
            title: 'Review Submitted! ',
            text: 'Thank you for your feedback.',
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
      setShowReviewModal(false);
    } catch (error) {
      console.error('Review submission error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Review Failed',
        text: 'Failed to submit review. Please try again.',
      });
    }
  };

  useEffect(() => {
    const fetchOrdersAndReviews = async () => {
      try {
        // Fetch orders
        const ordersRes = await api.get("/orders");
        setOrders(ordersRes.data);

        // Fetch user's reviews to determine which products they've already reviewed
        const reviewed = new Set();
        try {
          // Get all products from orders and check reviews for each
          const productIds = [...new Set(ordersRes.data.flatMap(order =>
            order.products.map(item => item.product)
          ))];

          // For each product, check if user has reviewed it
          for (const productId of productIds) {
            if (!productId || productId === 'undefined') continue;

            try {
              const checkRes = await api.get(`/products/${productId}/check-review`);
              if (checkRes.data.hasReviewed) {
                reviewed.add(productId);
              }
            } catch (error) {
              // Product might not exist or user not authenticated, continue
              console.log(`Could not check review status for product ${productId}:`, error.response?.data?.message || error.message);
            }
          }
        } catch (error) {
          console.log('Error fetching reviews:', error);
        }

        setReviewedProducts(reviewed);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrdersAndReviews();
  }, []);

  const showInvoice = (order) => {
    const productsList = order.products.map(item =>
      `<div class="flex justify-between items-center py-2 border-b border-gray-200">
        <div class="flex items-center">
          <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded mr-3">
          <div>
            <p class="font-medium">${item.name}</p>
            <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
          </div>
        </div>
        <p class="font-semibold">₹${item.price * item.quantity}</p>
      </div>`
    ).join('');

    Swal.fire({
      title: `Invoice - Order #${order._id.slice(-8)}`,
      html: `
        <div class="text-left">
          <div class="mb-4">
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status || 'Order Placed'}</p>
          </div>
          <div class="border-t border-gray-300 pt-4">
            <h3 class="font-semibold mb-3">Items Ordered:</h3>
            ${productsList}
            <div class="flex justify-between items-center pt-4 border-t border-gray-300">
              <p class="font-bold text-lg">Total Amount:</p>
              <p class="font-bold text-lg text-green-600">₹${order.totalAmount}</p>
            </div>
          </div>
        </div>
      `,
      width: '600px',
      confirmButtonText: 'Close',
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

  const downloadInvoice = async (order) => {
    // Helper function to safely get shipping address values
    const getShippingValue = (field) => {
      return order.shippingAddress && order.shippingAddress[field] ? order.shippingAddress[field] : 'N/A';
    };

    // Create a temporary invoice element
    const invoiceElement = document.createElement('div');
    invoiceElement.className = 'invoice-container';
    invoiceElement.style.position = 'absolute';
    invoiceElement.style.left = '-9999px';
    invoiceElement.style.top = '-9999px';
    invoiceElement.style.width = '800px';
    invoiceElement.style.background = 'white';
    invoiceElement.style.padding = '40px';
    invoiceElement.style.fontFamily = 'Arial, sans-serif';

    invoiceElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px;">Order Invoice</h1>
        <p style="color: #666;">Order #${order._id.slice(-8)}</p>
        <p style="font-size: 14px; color: #999;">Placed on ${new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">Order Items</h2>
        <div style="border-bottom: 1px solid #eee; padding-bottom: 20px;">
          ${order.products.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
              <div style="display: flex; align-items: center;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                <div>
                  <h3 style="font-weight: 600; color: #333; margin-bottom: 5px;">${item.name}</h3>
                  <p style="font-size: 14px; color: #666;">Quantity: ${item.quantity}</p>
                </div>
              </div>
              <p style="font-weight: 600; color: #333;">₹${item.price * item.quantity}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; margin-bottom: 40px;">
        <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">Order Summary</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Subtotal:</span>
          <span>₹${(() => {
            const total = Number(order.totalAmount) || 0;
            const subtotal = total / 1.18;
            const shipping = subtotal > 500 ? 0 : 50;
            return Math.max(0, Math.round(subtotal - shipping));
          })()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Shipping:</span>
          <span>₹${(() => {
            const total = Number(order.totalAmount) || 0;
            const subtotal = total / 1.18;
            return subtotal > 500 ? 0 : 50;
          })()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Tax (18%):</span>
          <span>₹${(() => {
            const total = Number(order.totalAmount) || 0;
            const subtotal = total / 1.18;
            const shipping = subtotal > 500 ? 0 : 50;
            const taxableAmount = subtotal - shipping;
            return Math.round(Math.max(0, taxableAmount) * 0.18);
          })()}</span>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
          <span>Total:</span>
          <span>₹${order.totalAmount}</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
        <div>
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">Shipping Address</h2>
          <div style="color: #666;">
            <p style="font-weight: 600; color: #333;">${getShippingValue('name')}</p>
            <p>${getShippingValue('address')}</p>
            <p>${getShippingValue('city')}, ${getShippingValue('state')} ${getShippingValue('zipCode')}</p>
            <p>${getShippingValue('phone')}</p>
            <p>${getShippingValue('email')}</p>
          </div>
        </div>
        <div>
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">Payment Method</h2>
          <p style="color: #666; text-transform: capitalize;">${order.paymentMethod || 'N/A'}</p>
          <p style="font-size: 14px; color: ${order.isPaid ? '#10b981' : '#f59e0b'};">Order Status: ${order.isPaid ? 'Completed' : 'Order Placed'}</p>
        </div>
      </div>
    `;

    document.body.appendChild(invoiceElement);

    try {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
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

      pdf.save(`invoice-${order._id.slice(-8)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to generate PDF. Please try again.',
      });
    } finally {
      document.body.removeChild(invoiceElement);
    }
  };

  return (
    <section className="max-w-11xl mx-auto px-6 py-12 bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 min-h-screen wavy-bg">


      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="max-w-md text-center py-16 px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Your Orders
            </h2>
            <p className="text-xl text-gray-600 mb-8">Track and manage your purchases</p>
            <p className="text-2xl text-gray-500 italic mb-6 flex items-center justify-center gap-3">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              No orders found.....
            </p>
            <p className="text-sm text-gray-500">Your shopping journey starts here! ✨</p>
          </div>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-black">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">₹{order.totalAmount}</p>
                <p className="text-sm text-gray-600">{order.status || 'Completed'}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Items ({order.products.length})</h4>
              <div className="space-y-2">
                {order.products.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                      <button
                        onClick={() => openReviewModal(item.product)}
                        disabled={reviewedProducts.has(item.product)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                          reviewedProducts.has(item.product)
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }`}
                      >
                        {reviewedProducts.has(item.product) ? 'Reviewed' : 'Write Review'}
                      </button>
                    </div>
                  </div>
                ))}
                {order.products.length > 2 && (
                  <p className="text-sm text-gray-600">+{order.products.length - 2} more items</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => showInvoice(order)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                View Invoice
              </button>
              <button
                onClick={() => downloadInvoice(order)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                📄 Download Invoice
              </button>
            </div>
          </div>
        ))
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className={`text-2xl ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="Share your thoughts about this product..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
    
  );
}
