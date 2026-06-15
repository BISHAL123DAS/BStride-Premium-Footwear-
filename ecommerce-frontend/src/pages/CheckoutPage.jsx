import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchCart, clearCartAPI } from "../api/cartApi";
import { createOrder, verifyPayment } from "../api/orderApi";
// ── Add these imports to CheckoutPage.jsx ──
import { useDispatch } from "react-redux";
import { clearCart, resetCart } from "../store/Cartslice";

import {
  MapPin, Phone, User, Home, Building, Hash, Landmark,
  ChevronRight, ShoppingBag, Truck, Tag, CreditCard,
  Banknote, CheckCircle, ArrowLeft, ShieldCheck,
} from "lucide-react";

const DELIVERY_FEE_THRESHOLD = 999;
const DELIVERY_FEE = 99;

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [itemsTotal, setItemsTotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);

  const deliveryFee = itemsTotal >= DELIVERY_FEE_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = cartItems.length >= 3 ? Math.round(itemsTotal * 0.05) : 0;
  const totalAmount = itemsTotal + deliveryFee - discount;

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // ── Fetch cart from API ──
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await fetchCart();
        const items = res.data.items || [];
        setCartItems(items);
        setItemsTotal(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setCartLoading(false);
      }
    };
    loadCart();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone = "Enter valid 10-digit phone";
    if (!form.addressLine.trim()) errors.addressLine = "Address is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.state.trim()) errors.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode)) errors.pincode = "Enter valid 6-digit pincode";
    return errors;
  };

  // ── Load Razorpay script dynamically ──
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });


  // ── Add inside component ──
  const dispatch = useDispatch();

  const handlePlaceOrder = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (cartItems.length === 0) return;

    setLoading(true);
    setError("");

    const orderPayload = {
      items: cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        brand: item.brand,
        image: item.image || "",
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize || "",
      })),
      shippingAddress: form,
      paymentMethod,
      itemsTotal,
      deliveryFee,
      discount,
      totalAmount,
    };

    try {
      const res = await createOrder(orderPayload);
      const { order, razorpayOrder, keyId } = res.data;

      // ── COD flow ──
      if (paymentMethod === "COD") {
        dispatch(resetCart());          // ← clear Redux state instantly
        dispatch(clearCart());          // ← clear backend cart (async)
        navigate(`/order-confirmation/${order._id}`);
        return;
      }

      // ── Razorpay flow ──
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Failed to load Razorpay. Check your connection.");
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "STRIDE",
        description: "Sneakers & Streetwear",
        order_id: razorpayOrder.id,
        // ← ADD THIS
        // ← ADD THIS
        config: {
          display: {
            preferences: {
              show_default_blocks: true,
            },
            blocks: {
              banks: {
                name: "Pay via UPI",
                instruments: [
                  { method: "upi", flows: ["collect", "qr", "intent"] }, // ← collect first
                ],
              },
            },
            sequence: ["block.banks"],
          },
        },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });
            dispatch(resetCart());      // ← clear Redux state instantly
            dispatch(clearCart());      // ← clear backend cart (async)
            navigate(`/order-confirmation/${order._id}`);
          } catch {
            setError("Payment verification failed. Contact support.");
            setLoading(false);
          }
        },
        prefill: {
          name: form.fullName,
          contact: form.phone,
        },
        theme: { color: "#a3e635" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Try again.");
      setLoading(false);
    }
  };

  // ── Loading state ──
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Empty cart guard ──
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
          <ShoppingBag size={36} strokeWidth={1.2} />
        </div>
        <h2 className="text-xl font-black text-white">Your cart is empty</h2>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-lime-400 hover:underline">
          <ArrowLeft size={14} /> Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* ── HEADER ── */}
      <div className="border-b border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-zinc-500 hover:text-lime-400 text-sm transition-colors mb-4">
            <ArrowLeft size={14} /> Back to Cart
          </Link>
          <h1 className="text-4xl font-black text-white">
            Check<span className="text-lime-400">out</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {cartItems.reduce((s, i) => s + i.quantity, 0)} items · ₹{totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── LEFT — Form ── */}
          <div className="lg:col-span-2 space-y-8">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* ── Delivery Address ── */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                  <MapPin size={15} />
                </div>
                <h2 className="text-lg font-black text-white">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={<User size={14} />} label="Full Name" name="fullName"
                  placeholder="John Doe" value={form.fullName} onChange={handleChange}
                  error={formErrors.fullName} />

                <Field icon={<Phone size={14} />} label="Phone Number" name="phone"
                  placeholder="9876543210" value={form.phone} onChange={handleChange}
                  error={formErrors.phone} maxLength={10} />

                <div className="sm:col-span-2">
                  <Field icon={<Home size={14} />} label="Address" name="addressLine"
                    placeholder="Flat no, Street, Area" value={form.addressLine}
                    onChange={handleChange} error={formErrors.addressLine} />
                </div>

                <Field icon={<Building size={14} />} label="City" name="city"
                  placeholder="Mumbai" value={form.city} onChange={handleChange}
                  error={formErrors.city} />

                <Field icon={<Landmark size={14} />} label="State" name="state"
                  placeholder="Maharashtra" value={form.state} onChange={handleChange}
                  error={formErrors.state} />

                <Field icon={<Hash size={14} />} label="Pincode" name="pincode"
                  placeholder="400001" value={form.pincode} onChange={handleChange}
                  error={formErrors.pincode} maxLength={6} />
              </div>
            </div>

            {/* ── Payment Method ── */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                  <CreditCard size={15} />
                </div>
                <h2 className="text-lg font-black text-white">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* COD */}
                <button onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all
                    ${paymentMethod === "COD" ? "border-lime-400 bg-lime-400/5" : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${paymentMethod === "COD" ? "bg-lime-400/20 text-lime-400" : "bg-zinc-800 text-zinc-400"}`}>
                    <Banknote size={18} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${paymentMethod === "COD" ? "text-white" : "text-zinc-300"}`}>
                      Cash on Delivery
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">Pay when your order arrives</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${paymentMethod === "COD" ? "border-lime-400" : "border-zinc-600"}`}>
                    {paymentMethod === "COD" && <div className="w-2.5 h-2.5 rounded-full bg-lime-400" />}
                  </div>
                </button>

                {/* Razorpay */}
                <button onClick={() => setPaymentMethod("Razorpay")}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all
                    ${paymentMethod === "Razorpay" ? "border-lime-400 bg-lime-400/5" : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${paymentMethod === "Razorpay" ? "bg-lime-400/20 text-lime-400" : "bg-zinc-800 text-zinc-400"}`}>
                    <CreditCard size={18} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${paymentMethod === "Razorpay" ? "text-white" : "text-zinc-300"}`}>
                      Pay Online
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">UPI, Cards, Net Banking</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${paymentMethod === "Razorpay" ? "border-lime-400" : "border-zinc-600"}`}>
                    {paymentMethod === "Razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-lime-400" />}
                  </div>
                </button>
              </div>

              {paymentMethod === "Razorpay" && (
                <div className="mt-3 flex items-center gap-2 text-zinc-500 text-xs">
                  <ShieldCheck size={13} className="text-lime-400" />
                  Secured by Razorpay — 100% safe & encrypted
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT — Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-6">
              <h2 className="text-lg font-black text-white mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={item.product || idx} className="flex gap-3">
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
                      <p className="text-white text-xs font-bold leading-snug line-clamp-1">{item.name}</p>
                      <p className="text-zinc-500 text-[11px] mt-0.5">
                        {item.selectedSize && <span className="text-zinc-400">Size: {item.selectedSize} · </span>}
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-lime-400 text-xs font-black shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Items total</span>
                  <span className="text-white font-semibold">₹{itemsTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1"><Truck size={13} /> Delivery</span>
                  <span className={deliveryFee === 0 ? "text-emerald-400 font-semibold" : "text-white font-semibold"}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1"><Tag size={13} /> 5% off (3+ items)</span>
                    <span>−₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-zinc-800 pt-3 flex justify-between">
                  <span className="text-white font-black">Total</span>
                  <span className="text-lime-400 font-black text-xl">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={handlePlaceOrder} disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-2
                           bg-lime-400 hover:bg-lime-300 text-black font-black
                           py-4 rounded-xl transition-all duration-150
                           hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed
                           disabled:hover:scale-100 text-sm">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Processing...</>
                ) : (
                  <>{paymentMethod === "COD" ? <CheckCircle size={16} /> : <CreditCard size={16} />}
                    {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
                    <ChevronRight size={15} /></>
                )}
              </button>

              <p className="text-zinc-600 text-[11px] text-center mt-3">
                By placing order you agree to our Terms & Privacy Policy
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ── Reusable form field ──
const Field = ({ icon, label, name, placeholder, value, onChange, error, maxLength }) => (
  <div>
    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">{label}</label>
    <div className={`flex items-center gap-3 bg-zinc-900 border rounded-xl px-4 py-3 transition-all
                    ${error ? "border-red-500/60" : "border-zinc-700 focus-within:border-lime-400"}`}>
      <span className="text-zinc-500 shrink-0">{icon}</span>
      <input type="text" name={name} value={value} onChange={onChange}
        placeholder={placeholder} maxLength={maxLength}
        className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600" />
    </div>
    {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
  </div>
);

export default CheckoutPage;