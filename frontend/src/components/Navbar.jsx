import { useState } from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, ShoppingBag, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";


const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            to={"/"}
            onClick={closeMobileMenu}
            className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            E-Commerce
          </Link>

          {/* Hamburger Menu Toggle Button (Small & Extra Small devices) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-emerald-400 focus:outline-none p-2 rounded-md transition duration-300"
            aria-label="Toggle navbar menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation (Medium, Large & Extra Large devices) */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>
            <Link
              to={"/categories"}
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Categories
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 
			          ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {user && (
              <Link
                to={"/orders"}
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 
			          ease-in-out"
              >
                <ShoppingBag
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                <span>Orders</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span>Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogOut size={18} />
                <span className="ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Dropdown Navigation (Small & Extra Small devices) */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-3 pt-3 border-t border-emerald-800/60 flex flex-col space-y-3 pb-2 transition-all duration-300">
            <Link
              to={"/"}
              onClick={closeMobileMenu}
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-gray-800/60 flex items-center"
            >
              Home
            </Link>
            <Link
              to={"/categories"}
              onClick={closeMobileMenu}
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-gray-800/60 flex items-center"
            >
              Categories
            </Link>
            {user && (
              <Link
                to={"/cart"}
                onClick={closeMobileMenu}
                className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-gray-800/60 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <ShoppingCart className="mr-2" size={20} />
                  <span>Cart</span>
                </div>
                {cart.length > 0 && (
                  <span className="bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {user && (
              <Link
                to={"/orders"}
                onClick={closeMobileMenu}
                className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-gray-800/60 flex items-center"
              >
                <ShoppingBag className="mr-2" size={20} />
                <span>Orders</span>
              </Link>
            )}
            {isAdmin && (
              <Link
                to={"/secret-dashboard"}
                onClick={closeMobileMenu}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="mr-2" size={18} />
                <span>Dashboard</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out w-full text-left"
              >
                <LogOut size={18} />
                <span className="ml-2">Log Out</span>
              </button>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-800">
                <Link
                  to={"/signup"}
                  onClick={closeMobileMenu}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  onClick={closeMobileMenu}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
