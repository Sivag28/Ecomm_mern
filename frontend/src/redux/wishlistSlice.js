import { createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      if (!state.items.find(i => i._id === item._id)) {
        state.items.push(item);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    toggleWishlist: (state, action) => {
      const item = action.payload;
      const index = state.items.findIndex(i => i._id === item._id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(item);
      }
    },
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, setWishlist } = wishlistSlice.actions;

// Thunk for toggling wishlist with API call
export const toggleWishlistAsync = (product) => async (dispatch, getState) => {
  try {
    const { user } = getState().user;
    if (!user) return;

    // Optimistically update UI
    dispatch(toggleWishlist(product));

    // Make API call
    await api.post(`/wishlist/${product._id}`);
  } catch (error) {
    console.error('Wishlist toggle error:', error);
    // Revert optimistic update on error
    dispatch(toggleWishlist(product));
  }
};

export default wishlistSlice.reducer;
