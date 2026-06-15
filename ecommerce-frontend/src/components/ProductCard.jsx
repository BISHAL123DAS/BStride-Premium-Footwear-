import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addToCart, selectCartItems } from "../store/Cartslice";
import { addToWishlist, removeFromWishlist, selectWishlistItems } from "../store/wishlistSlice";
import { Heart, ShoppingCart, Tag, Check } from "lucide-react";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const wishlist = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);

  const isWishlisted = wishlist.some(
    (p) => p.product?.toString() === product._id || p._id?.toString() === product._id
  );
  const cartItem = cartItems.find(
    (i) => i.product?.toString() === product._id || i._id?.toString() === product._id
  );
  const inCart = Boolean(cartItem);
  const isOutOfStock = product.stock === 0;

  // ── PRICE / DISCOUNT LOGIC ─────────────────────────────────────
  const sellingPrice = Number(product.price);
  const originalPrice = Number(product.showPrice);
  const hasDiscount = originalPrice && originalPrice > sellingPrice;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;
  const savedAmount = hasDiscount
    ? (originalPrice - sellingPrice).toLocaleString()
    : 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) return;
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user || isOutOfStock) return;
    dispatch(addToCart(product));
  };

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-600 hover:-translate-y-1 transition-all duration-300">

      {/* IMAGE */}
      <Link to={`/products/${product._id}`} className="relative block">
        <div className="aspect-square bg-zinc-800 overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">👟</div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
              <span className="text-xs font-black text-white bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full uppercase tracking-widest">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Category badge */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-lime-400 text-zinc-900 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
          <Tag size={9} strokeWidth={2.5} />
          {product.category}
        </span>

        {/* Discount badge — only if discount exists
        {hasDiscount && (
          <span className="absolute top-10 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {discountPct}% OFF
          </span>
        )} */}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full
                      backdrop-blur-sm border flex items-center justify-center
                      transition-all duration-200
                      ${isWishlisted
              ? "bg-red-500/20 border-red-500/50 text-red-400"
              : "bg-zinc-900/80 border-zinc-700 text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
            }`}
        >
          <Heart size={13} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </Link>

      {/* DETAILS */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">
          {product.brand}
        </p>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-white text-sm leading-snug mb-3 hover:text-lime-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* ── PRICE BLOCK ── */}
        <div className="mb-3 mt-auto">

          <div className="flex items-center gap-2 flex-wrap">
            {/* Selling price */}
            <span className="text-xl font-black text-lime-400">
              ₹{sellingPrice.toLocaleString()}
            </span>

            {/* Original price + discount % */}
            {hasDiscount && (
              <>
                <span className="text-sm text-zinc-500 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {discountPct}% off
                </span>
              </>
            )}
          </div>

          {/* You save line */}
          {hasDiscount && (
            <p className="text-[11px] text-zinc-500 mt-0.5">
              You save ₹{savedAmount}
            </p>
          )}

          {/* Stock badge */}
          <div className="mt-2">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${product.stock > 10
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : product.stock > 0
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
              {product.stock > 0 ? `${product.stock} left` : "Sold out"}
            </span>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2
                      text-xs font-bold py-2.5 rounded-xl border
                      transition-all duration-200 group/btn
                      ${inCart
              ? "bg-lime-400/10 border-lime-400/30 text-lime-400 cursor-default"
              : isOutOfStock
                ? "bg-zinc-800/40 border-zinc-700 text-zinc-600 cursor-not-allowed"
                : "bg-zinc-800 hover:bg-lime-400 text-zinc-300 hover:text-zinc-900 border-zinc-700 hover:border-lime-400"
            }`}
        >
          {inCart ? (
            <><Check size={13} /> Added ({cartItem.quantity})</>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            <><ShoppingCart size={13} className="group-hover/btn:scale-110 transition-transform duration-150" /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;