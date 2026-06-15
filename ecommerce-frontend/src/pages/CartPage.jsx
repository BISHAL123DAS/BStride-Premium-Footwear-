
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartItems,   // ← updated
  selectCartTotal,   // ← updated
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from "../store/Cartslice";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight,
  Tag, ShoppingBag, X, ChevronRight,
} from "lucide-react";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);  // ← no (user?.id)
  const cartTotal = useSelector(selectCartTotal);  // ← no (user?.id)

  const DELIVERY_FEE = cartTotal >= 999 ? 0 : 99;
  const DISCOUNT     = cartItems.length >= 3 ? Math.round(cartTotal * 0.05) : 0;
  const finalTotal   = cartTotal + DELIVERY_FEE - DISCOUNT;


  const handleRemove   = (productId) => dispatch(removeFromCart(productId)); // ← no userId
  const handleIncrease = (productId) => dispatch(increaseQty(productId));    // ← no userId
  const handleDecrease = (productId) => dispatch(decreaseQty(productId));    // ← no userId
  const handleClearCart = ()         => dispatch(clearCart());               // ← no userId

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* HEADER */}
      <div className="border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-widest mb-3">
                <ShoppingCart size={14} /> Your Cart
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
                My<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-300">Bag</span>
              </h1>
            </div>
            {cartItems.length > 0 && (
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-none">{cartItems.reduce((s, i) => s + i.quantity, 0)}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">items in cart</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-6">
              <ShoppingBag size={40} strokeWidth={1.2} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Your bag is empty</h2>
            <p className="text-zinc-500 text-sm max-w-xs mb-8 leading-relaxed">Add some sneakers or apparel to get started.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-lime-400 text-black font-bold text-sm px-6 py-3 rounded-xl hover:bg-lime-300 hover:scale-105 transition-all duration-150">
              Browse Products <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT — Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-400 text-sm">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
                <button onClick={handleClearCart} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-lime-400 transition-colors">
                  <X size={12} /> Clear all
                </button>
              </div>

              {cartItems.map((item) => (
                <div key={item._id} className="group flex gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-all duration-200">
                  <Link to={`/products/${item._id}`} className="shrink-0">
                    <div className="w-24 h-24 rounded-xl bg-zinc-800 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600"><ShoppingBag size={28} strokeWidth={1} /></div>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1 bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-1.5">
                          <Tag size={9} /> {item.category}
                        </span>
                        <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">{item.brand}</p>
                        <Link to={`/products/${item._id}`}>
                          <h3 className="font-bold text-white text-sm leading-snug mt-0.5 hover:text-lime-400 transition-colors line-clamp-2">{item.name}</h3>
                        </Link>
                        {item.selectedSize && (
                          <p className="text-xs text-zinc-500 mt-0.5">Size: <span className="text-zinc-300">{item.selectedSize}</span></p>
                        )}
                      </div>
                      <button onClick={() => handleRemove(item.product)}
                        className="shrink-0 w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-all duration-150">
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-black text-lime-400">₹{(item.price * item.quantity).toLocaleString()}</span>
                      <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-1 py-1">
                        <button onClick={() => handleDecrease(item.product)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all">
                          <Minus size={13} />
                        </button>
                        <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                        <button onClick={() => handleIncrease(item.product)} disabled={item.quantity >= item.stock}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-zinc-600 text-xs mt-1">₹{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                </div>
              ))}

              <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-lime-400 transition-colors mt-2">
                <ArrowRight size={14} className="rotate-180" /> Continue shopping
              </Link>
            </div>

            {/* RIGHT — Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-6">
                <h2 className="text-lg font-black text-white mb-6">Order Summary</h2>

                {cartTotal < 999 && (
                  <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 mb-5">
                    <p className="text-amber-400 text-xs font-semibold">Add ₹{(999 - cartTotal).toLocaleString()} more for free delivery!</p>
                    <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${Math.min((cartTotal / 999) * 100, 100)}%` }} />
                    </div>
                  </div>
                )}
                {cartTotal >= 999 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-5">
                    <p className="text-emerald-400 text-xs font-semibold">🎉 You've unlocked free delivery!</p>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="text-white font-semibold">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Delivery</span>
                    <span className={DELIVERY_FEE === 0 ? "text-emerald-400 font-semibold" : "text-white font-semibold"}>
                      {DELIVERY_FEE === 0 ? "FREE" : `₹${DELIVERY_FEE}`}
                    </span>
                  </div>
                  {DISCOUNT > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>5% off (3+ items)</span>
                      <span>−₹{DISCOUNT.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-zinc-800 pt-3 flex justify-between">
                    <span className="text-white font-black text-base">Total</span>
                    <span className="text-lime-400 font-black text-xl">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={() => navigate("/checkout")}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-black py-4 rounded-xl transition-all duration-150 hover:scale-[1.02] text-sm">
                  Proceed to Checkout <ChevronRight size={16} />
                </button>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[{ icon: <Tag size={13} />, label: "Best Price" }, { icon: <ShoppingBag size={13} />, label: "Easy Returns" }].map((b) => (
                    <div key={b.label} className="flex items-center gap-2 bg-zinc-800/60 rounded-xl px-3 py-2">
                      <span className="text-lime-400">{b.icon}</span>
                      <span className="text-zinc-400 text-[11px] font-semibold">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;