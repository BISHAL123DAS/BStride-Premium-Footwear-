import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist, selectWishlistItems } from "../store/wishlistSlice";
import {
  Heart, Trash2, ArrowRight, ShoppingBag, Tag,
  PackageCheck, PackageX, AlertTriangle,
} from "lucide-react";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlistItems);

  const handleRemove = (item) => {
    // backend item has product field (ObjectId), fallback to _id
    const productId = item.product?.toString() || item._id?.toString();
    dispatch(removeFromWishlist(productId));
  };

  // backend item has product field for the real product ID
  const getProductId = (item) => item.product?.toString() || item._id?.toString();

  const getStockInfo = (stock) => {
    if (stock > 10) return { label: `${stock} left`, icon: <PackageCheck size={11} />, className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" };
    if (stock > 0)  return { label: `Only ${stock} left`, icon: <AlertTriangle size={11} />, className: "bg-amber-500/10 text-amber-400 border border-amber-500/20" };
    return           { label: "Sold out", icon: <PackageX size={11} />, className: "bg-red-500/10 text-red-400 border border-red-500/20" };
  };

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* TOP BANNER */}
      <div className="border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Heart size={14} fill="currentColor" stroke="none" /> Wishlist
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
                Saved<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-300">Items</span>
              </h1>
            </div>
            {wishlist.length > 0 && (
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <Heart size={18} fill="currentColor" stroke="none" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-none">{wishlist.length}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">saved item{wishlist.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-6">
              <ShoppingBag size={40} strokeWidth={1.2} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Nothing saved yet</h2>
            <p className="text-zinc-500 text-sm max-w-xs mb-8 leading-relaxed">Tap the heart on any product to save it here for later.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-lime-400 text-black font-bold text-sm px-6 py-3 rounded-xl hover:bg-lime-300 hover:scale-105 transition-all duration-150">
              Browse Products <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlist.map((item, i) => {
              const productId = getProductId(item); // ← correct ID for routing
              const stock     = getStockInfo(item.stock);
              return (
                <div key={item._id || productId}
                  className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-600 hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${i * 60}ms` }}>

                  {/* IMAGE */}
                  <Link to={`/products/${productId}`} className="relative block">
                    <div className="aspect-square bg-zinc-800 overflow-hidden">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <ShoppingBag size={48} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-lime-400 text-zinc-900 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
                      <Tag size={10} strokeWidth={2.5} />{item.category}
                    </span>
                    <button
                      onClick={(e) => { e.preventDefault(); handleRemove(item); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 text-zinc-400 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Remove from wishlist">
                      <Trash2 size={13} />
                    </button>
                  </Link>

                  {/* DETAILS */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">{item.brand}</p>
                    <Link to={`/products/${productId}`}>
                      <h3 className="font-bold text-white text-sm leading-snug mb-3 hover:text-lime-400 transition-colors line-clamp-2">{item.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <span className="text-xl font-black text-lime-400">₹{item.price.toLocaleString()}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${stock.className}`}>
                        {stock.icon}{stock.label}
                      </span>
                    </div>
                    <Link to={`/products/${productId}`}
                      className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-lime-400 text-zinc-300 hover:text-zinc-900 text-xs font-bold py-2.5 rounded-xl border border-zinc-700 hover:border-lime-400 transition-all duration-200 group/btn">
                      View Product
                      <ArrowRight size={13} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-150" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;