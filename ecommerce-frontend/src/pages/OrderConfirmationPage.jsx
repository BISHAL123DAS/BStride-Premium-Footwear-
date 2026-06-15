import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSingleOrder } from "../api/orderApi";
import {
  CheckCircle,
  Package,
  MapPin,
  Truck,
  ShoppingBag,
  ArrowRight,
  ClipboardList,
  Banknote,
  CreditCard,
} from "lucide-react";

const STATUS_STEPS = ["confirmed", "shipped", "delivered"];

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSingleOrder(id)
      .then((res) => setOrder(res.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">Order not found.</p>
        <Link to="/" className="text-lime-400 text-sm hover:underline">Back to shop</Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Success header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full
                          bg-lime-400/10 border-2 border-lime-400/30 text-lime-400 mb-5">
            <CheckCircle size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Order Placed!</h1>
          <p className="text-zinc-400 text-sm">
            Thank you for shopping with <span className="text-lime-400 font-bold">STRIDE</span>
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800
                          px-4 py-2 rounded-full text-xs text-zinc-400">
            <ClipboardList size={12} />
            Order ID: <span className="text-white font-mono font-bold">{order._id}</span>
          </div>
        </div>

        {/* ── Order Status Tracker ── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Package size={15} className="text-lime-400" /> Order Status
          </h2>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all
                                  ${i <= currentStep
                                    ? "bg-lime-400 border-lime-400 text-black"
                                    : "bg-zinc-800 border-zinc-700 text-zinc-600"}`}>
                    {i <= currentStep ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <p className={`text-[10px] font-semibold mt-1.5 capitalize ${i <= currentStep ? "text-lime-400" : "text-zinc-600"}`}>
                    {step}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mb-4 transition-all ${i < currentStep ? "bg-lime-400" : "bg-zinc-800"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-6">

          {/* ── Delivery Address ── */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-lime-400" /> Deliver to
            </h2>
            <p className="text-white text-sm font-bold">{order.shippingAddress.fullName}</p>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
              {order.shippingAddress.addressLine},<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
            <p className="text-zinc-500 text-xs mt-1">📞 {order.shippingAddress.phone}</p>
          </div>

          {/* ── Payment Info ── */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              {order.paymentMethod === "COD" ? <Banknote size={14} className="text-lime-400" /> : <CreditCard size={14} className="text-lime-400" />}
              Payment
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-zinc-400 text-xs">Method:</span>
              <span className="text-white text-xs font-bold">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-zinc-400 text-xs">Status:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                order.paymentStatus === "paid"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}>
                {order.paymentStatus === "paid" ? "Paid" : "Pay on delivery"}
              </span>
            </div>
            <div className="border-t border-zinc-800 pt-3 flex justify-between">
              <span className="text-zinc-400 text-xs">Total Paid</span>
              <span className="text-lime-400 font-black">₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── Items ── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingBag size={14} className="text-lime-400" />
            Items Ordered ({order.items.length})
          </h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <ShoppingBag size={20} strokeWidth={1} />
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

          {/* Totals */}
          <div className="border-t border-zinc-800 mt-4 pt-4 space-y-1.5 text-sm">
            {order.deliveryFee === 0 ? (
              <div className="flex justify-between text-emerald-400 text-xs">
                <span className="flex items-center gap-1"><Truck size={12} /> Free Delivery</span>
                <span>₹0</span>
              </div>
            ) : (
              <div className="flex justify-between text-zinc-400 text-xs">
                <span className="flex items-center gap-1"><Truck size={12} /> Delivery</span>
                <span>₹{order.deliveryFee}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400 text-xs">
                <span>Discount</span>
                <span>−₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-zinc-800">
              <span className="text-white font-black">Total</span>
              <span className="text-lime-400 font-black text-lg">₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2
                       bg-lime-400 hover:bg-lime-300 text-black font-black
                       py-3.5 rounded-xl transition-all hover:scale-[1.02] text-sm"
          >
            Continue Shopping <ArrowRight size={15} />
          </Link>
          <Link
            to="/my-orders"
            className="flex-1 flex items-center justify-center gap-2
                       bg-zinc-800 hover:bg-zinc-700 border border-zinc-700
                       text-white font-bold py-3.5 rounded-xl transition-all text-sm"
          >
            <ClipboardList size={15} /> View My Orders
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;