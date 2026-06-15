import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";
import {
  Package, ChevronRight, ArrowLeft, ShoppingBag,
  MapPin, CreditCard, Banknote, Clock, CheckCircle,
  Truck, PackageCheck, XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   icon: <Clock size={12} />,        className: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  confirmed: { label: "Confirmed", icon: <CheckCircle size={12} />,  className: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  shipped:   { label: "Shipped",   icon: <Truck size={12} />,        className: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
  delivered: { label: "Delivered", icon: <PackageCheck size={12} />, className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  cancelled: { label: "Cancelled", icon: <XCircle size={12} />,      className: "bg-red-500/10 text-red-400 border border-red-500/20" },
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

const MyOrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* HEADER */}
      <div className="border-b border-zinc-800/60">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-lime-400 text-sm transition-colors mb-4">
            <ArrowLeft size={14} /> Back to shop
          </Link>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Package size={14} /> My Orders
              </div>
              <h1 className="text-5xl font-black text-white leading-none tracking-tight">
                Order
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-300">
                  History
                </span>
              </h1>
            </div>
            {orders.length > 0 && (
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-none">{orders.length}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">total order{orders.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-10">

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-6">
              <ShoppingBag size={40} strokeWidth={1.2} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">No orders yet</h2>
            <p className="text-zinc-500 text-sm max-w-xs mb-8 leading-relaxed">
              You haven't placed any orders yet. Start shopping!
            </p>
            <Link to="/" className="inline-flex items-center gap-2 bg-lime-400 text-black font-bold text-sm px-6 py-3 rounded-xl hover:bg-lime-300 hover:scale-105 transition-all duration-150">
              Browse Products <ChevronRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status   = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
              const isOpen   = expanded === order._id;

              return (
                <div key={order._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-200">

                  {/* ORDER ROW — click to expand */}
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
                        <Package size={18} />
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm truncate">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${status.className}`}>
                        {status.icon} {status.label}
                      </span>
                      {/* Total */}
                      <span className="text-lime-400 font-black text-sm hidden sm:block">
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                      {/* Chevron */}
                      <ChevronRight
                        size={16}
                        className={`text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>

                  {/* EXPANDED DETAIL */}
                  {isOpen && (
                    <div className="border-t border-zinc-800 px-5 pb-5 pt-4 space-y-5">

                      {/* Items */}
                      <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Items</p>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex gap-3 items-center">
                              <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                    <ShoppingBag size={18} strokeWidth={1} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold line-clamp-1">{item.name}</p>
                                <p className="text-zinc-500 text-xs mt-0.5">
                                  {item.brand}
                                  {item.selectedSize && <> · Size: <span className="text-zinc-400">{item.selectedSize}</span></>}
                                  {" · "}Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-lime-400 font-black text-sm shrink-0">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address + Payment */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-zinc-800/50 rounded-xl p-4">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <MapPin size={11} /> Delivery Address
                          </p>
                          <p className="text-white text-sm font-bold">{order.shippingAddress.fullName}</p>
                          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                            {order.shippingAddress.addressLine}, {order.shippingAddress.city},
                            {" "}{order.shippingAddress.state} — {order.shippingAddress.pincode}
                          </p>
                          <p className="text-zinc-500 text-xs mt-1">📞 {order.shippingAddress.phone}</p>
                        </div>

                        <div className="bg-zinc-800/50 rounded-xl p-4">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                            {order.paymentMethod === "COD" ? <Banknote size={11} /> : <CreditCard size={11} />}
                            Payment
                          </p>
                          <p className="text-white text-sm font-bold">
                            {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                          </p>
                          <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {order.paymentStatus === "paid" ? "Paid" : "Pay on delivery"}
                          </span>

                          {/* Price breakdown */}
                          <div className="mt-3 space-y-1 text-xs border-t border-zinc-700 pt-2">
                            <div className="flex justify-between text-zinc-500">
                              <span>Items</span>
                              <span>₹{order.itemsTotal?.toLocaleString()}</span>
                            </div>
                            {order.deliveryFee > 0 && (
                              <div className="flex justify-between text-zinc-500">
                                <span>Delivery</span>
                                <span>₹{order.deliveryFee}</span>
                              </div>
                            )}
                            {order.discount > 0 && (
                              <div className="flex justify-between text-emerald-400">
                                <span>Discount</span>
                                <span>−₹{order.discount}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-white font-bold pt-1 border-t border-zinc-700">
                              <span>Total</span>
                              <span className="text-lime-400">₹{order.totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;