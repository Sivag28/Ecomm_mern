import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";
import cartReducer from "../redux/cartSlice";
import wishlistReducer from "../redux/wishlistSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
