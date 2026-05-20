import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Deals from "./pages/Deals";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  const user = useSelector((state) => state.user.user);

  return (
    <BrowserRouter>
      {user ? <Navbar /> : null}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/category/:name" element={user ? <Category /> : <Navigate to="/login" />} />
        <Route path="/product/:id" element={user ? <ProductDetails /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/wishlist" element={user ? <Wishlist /> : <Navigate to="/login" />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/deals" element={user ? <Deals /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
