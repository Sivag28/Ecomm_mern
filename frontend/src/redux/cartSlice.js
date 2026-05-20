import { createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";

// Helper function to check if _id is a valid ObjectId (24 hex chars)
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadCartFromStorage() },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + (action.payload.quantity || 1);
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      // Only clear real products (with valid ObjectId), keep deals products
      state.items = state.items.filter(item => !isValidObjectId(item._id));
      saveCartToStorage(state.items);
    },
    setCart: (state, action) => {
      state.items = action.payload;
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;

// Thunk for adding to cart with API call
export const addToCartAsync = (product) => async (dispatch, getState) => {
  try {
    const { user } = getState().user;
    if (!user) return;

    // Optimistically update UI
    dispatch(addToCart(product));

    // Only save to backend if product has a valid ObjectId (real database products)
    if (isValidObjectId(product._id)) {
      // Save to backend - format cart as expected by backend
      const { items } = getState().cart;
      const formattedCart = items
        .filter(item => isValidObjectId(item._id)) // Only include real products
        .map(item => ({
          product: item._id,
          qty: item.quantity || 1
        }));
      await api.post('/cart', { cart: formattedCart });
    }
    // Deals products (with numeric IDs) are already saved to localStorage in addToCart
  } catch (error) {
    console.error('Add to cart error:', error);
    // Revert optimistic update on error
    dispatch(removeFromCart(product._id));
  }
};

export default cartSlice.reducer;
