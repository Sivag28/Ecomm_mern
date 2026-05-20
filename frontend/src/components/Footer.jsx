export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Wavy background effect */}
      <div className="absolute inset-0 wavy-bg opacity-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ShopVerse
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover amazing handmade products from talented artisans across India.
              Quality craftsmanship meets modern convenience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="/deals" className="text-gray-300 hover:text-blue-400 transition-colors">Deals</a></li>
              <li><a href="/categories" className="text-gray-300 hover:text-blue-400 transition-colors">Categories</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/category/home-living" className="text-gray-300 hover:text-purple-400 transition-colors">Home & Living</a></li>
              <li><a href="/category/jewelry-accessories" className="text-gray-300 hover:text-purple-400 transition-colors">Jewelry</a></li>
              <li><a href="/category/clothing-wearables" className="text-gray-300 hover:text-purple-400 transition-colors">Fashion</a></li>
              <li><a href="/category/art-collectibles" className="text-gray-300 hover:text-purple-400 transition-colors">Art & Collectibles</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect With Us</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📧 support@shopverse.com</p>
              <p>📱 +91 98765 43210</p>
              <p>📍 India</p>
            </div>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110">
                <span className="text-white text-xs">f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-110">
                <span className="text-white text-xs">📷</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-110">
                <span className="text-white text-xs">t</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ShopVerse. All rights reserved. Made with ❤️ for artisans.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
