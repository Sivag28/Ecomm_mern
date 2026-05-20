import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useState } from "react";

export default function Navbar() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className=" top-0 z-50 bg-blue shadow-md border border-black">
      <div className="font-bold max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        <Link to="/" className="text-xl md:text-2xl">
          ShopVerse
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="relative group">
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
          {["Deals", "Wishlist", "Cart", "Orders"].map(item => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="relative group"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </Link>
          ))}

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            {["Deals", "Wishlist", "Cart", "Orders"].map(item => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            {user && (
              <div className="py-2">
                <span className="block text-gray-700 mb-2">Hello, {user.name}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
