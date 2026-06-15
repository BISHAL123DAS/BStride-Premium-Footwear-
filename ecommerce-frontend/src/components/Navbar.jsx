import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/authApi";
import { clearWishlist, selectWishlistItems } from "../store/wishlistSlice"; 
import { clearCart, selectCartCount } from "../store/Cartslice";          
import { Heart, ShoppingCart } from "lucide-react";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlist = useSelector(selectWishlistItems); 
  const cartCount = useSelector(selectCartCount);    

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearWishlist()); 
      dispatch(clearCart());    
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-black text-xl tracking-tight text-lime-400 font-display">
          ⬡ BSTRIDE
        </Link>

        {/* Links */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-800">
            Shop
          </Link>

          {user ? (
            <>
              <span className="text-sm text-zinc-500 hidden sm:block">
                Hey, {user.username}
              </span>

              {/* Wishlist icon */}
              <Link to="/wishlist" className="relative">
                <div className="w-9 h-9 rounded-xl border border-zinc-700 bg-zinc-900
                                flex items-center justify-center text-zinc-400
                                hover:border-red-400/50 hover:text-red-400 transition-all">
                  <Heart size={17} />
                </div>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                                   bg-red-500 text-white text-[10px] font-black
                                   flex items-center justify-center leading-none">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart icon */}
              <Link to="/cart" className="relative">
                <div className="w-9 h-9 rounded-xl border border-zinc-700 bg-zinc-900
                                flex items-center justify-center text-zinc-400
                                hover:border-lime-400 hover:text-lime-400 transition-all">
                  <ShoppingCart size={17} />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                                   bg-lime-400 text-black text-[10px] font-black
                                   flex items-center justify-center leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              <Link to="/my-orders" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-800">
                Orders
              </Link>

              {/* Admin only */}
              {user.role === "admin" && (
                <Link to="/products/create" className="text-sm text-zinc-300 border border-zinc-700 hover:border-lime-400 hover:text-lime-400 px-3 py-1.5 rounded-md transition-all">
                  + Add Product
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-sm text-zinc-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-800">
                Login
              </Link>
              {/* <Link to="/register" className="text-sm font-semibold bg-lime-400 text-zinc-900 hover:bg-lime-300 px-4 py-1.5 rounded-md transition-all">
                Register
              </Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;