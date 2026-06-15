

import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "../api/authApi";
import { loadCart, resetCart } from "../store/Cartslice";            // ← resetCart
import { loadWishlist, resetWishlist } from "../store/wishlistSlice"; // ← resetWishlist

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch              = useDispatch();

  useEffect(() => {
    getMe()
      .then((res) => {
        const loggedInUser = res.data.user;
        setUser(loggedInUser);
        dispatch(loadCart());
        dispatch(loadWishlist());
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSetUser = (newUser) => {
    if (newUser) {
      dispatch(resetCart());     // ← sync, instant
      dispatch(resetWishlist()); // ← sync, instant
      setUser(newUser);
      dispatch(loadCart());
      dispatch(loadWishlist());
    } else {
      dispatch(resetCart());     // ← sync, instant
      dispatch(resetWishlist()); // ← sync, instant
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);