// import { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getSingleProduct, deleteProduct } from "../api/productApi";
// import { useAuth } from "../context/AuthContext";
// import { addToCart, selectUserCart } from "../store/Cartslice";
// import { addToWishlist, removeFromWishlist, selectUserWishlist } from "../store/wishlistSlice";
// import Alert from "../components/Alert";
// import {
//   Heart,
//   ShoppingCart,
//   Check,
//   Minus,
//   Plus,
//   Tag,
//   Truck,
//   RotateCcw,
//   ShieldCheck,
//   ChevronRight,
//   Pencil,
//   Trash2,
//   ArrowLeft,
// } from "lucide-react";

// const SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

// const ProductDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user } = useAuth();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [sizeError, setSizeError] = useState(false);
//   const [qty, setQty] = useState(1);
//   const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
//   const [deleting, setDeleting] = useState(false);

//   const wishlist = useSelector(selectUserWishlist(user?.id));
//   const cartItems = useSelector(selectUserCart(user?.id));

//   const isWishlisted = wishlist.some((p) => p._id === id);
//   const cartItem = cartItems.find((i) => i._id === id);
//   const inCart = Boolean(cartItem);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await getSingleProduct(id);
//         setProduct(res.data.product);
//       } catch (err) {
//         setError(err.response?.data?.message || "Product not found.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const showToast = (msg, type = "success") => {
//     setToast({ show: true, msg, type });
//     setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 2500);
//   };

//   const handleAddToCart = () => {
//     if (!selectedSize) {
//       setSizeError(true);
//       setTimeout(() => setSizeError(false), 2000);
//       return;
//     }
//     for (let i = 0; i < qty; i++) {
//       dispatch(addToCart({ userId: user.id, product: { ...product, selectedSize } }));
//     }
//     showToast(`Added to cart — Size ${selectedSize}`);
//   };

//   const handleWishlist = () => {
//     if (isWishlisted) {
//       dispatch(removeFromWishlist({ userId: user.id, productId: product._id }));
//       showToast("Removed from wishlist", "info");
//     } else {
//       dispatch(addToWishlist({ userId: user.id, product }));
//       showToast("Saved to wishlist ♥");
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Delete this product permanently?")) return;
//     setDeleting(true);
//     try {
//       await deleteProduct(id);
//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Delete failed.");
//       setDeleting(false);
//     }
//   };

//   // ── Loading ──
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <div className="w-8 h-8 border-2 border-zinc-700 border-t-lime-400 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // ── Error ──
//   if (error || !product) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
//         <Alert type="error" message={error || "Product not found."} />
//         <Link to="/" className="text-lime-400 text-sm hover:underline">← Back to shop</Link>
//       </div>
//     );
//   }

//   const images = product.images?.length ? product.images : [null];
//   const isOutOfStock = product.stock === 0;

//   return (
//     <div className="min-h-screen bg-zinc-950">

//       {/* ── TOAST ── */}
//       {toast.show && (
//         <div className={`fixed bottom-6 right-6 z-50 font-bold text-sm px-5 py-3 rounded-xl shadow-2xl
//                          flex items-center gap-2 transition-all
//                          ${toast.type === "success"
//                            ? "bg-lime-400 text-zinc-900"
//                            : "bg-zinc-800 text-zinc-300 border border-zinc-700"}`}>
//           <Check size={15} />
//           {toast.msg}
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto px-6 py-10">

//         {/* ── Breadcrumb ── */}
//         <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
//           <Link to="/" className="hover:text-lime-400 transition-colors flex items-center gap-1">
//             <ArrowLeft size={14} /> Shop
//           </Link>
//           <ChevronRight size={13} />
//           <span className="text-zinc-400">{product.category}</span>
//           <ChevronRight size={13} />
//           <span className="text-white truncate max-w-xs">{product.name}</span>
//         </nav>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

//           {/* ── LEFT — Image Gallery ── */}
//           <div className="flex flex-col gap-4">
//             {/* Main image */}
//             <div className="bg-zinc-900 border border-zinc-800 rounded-3xl aspect-square overflow-hidden relative group">
//               {images[selectedImage] ? (
//                 <img
//                   src={images[selectedImage]}
//                   alt={product.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-9xl opacity-10">👟</div>
//               )}
//               {/* Category badge */}
//               <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-lime-400 text-zinc-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
//                 <Tag size={10} strokeWidth={2.5} /> {product.category}
//               </span>
//               {/* Out of stock overlay */}
//               {isOutOfStock && (
//                 <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
//                   <span className="text-sm font-black text-white bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-full uppercase tracking-widest">
//                     Sold Out
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Thumbnail strip — only if multiple images */}
//             {images.length > 1 && (
//               <div className="flex gap-3 overflow-x-auto pb-1">
//                 {images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setSelectedImage(i)}
//                     className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
//                                 ${selectedImage === i
//                                   ? "border-lime-400 scale-105"
//                                   : "border-zinc-700 hover:border-zinc-500"}`}
//                   >
//                     {img ? (
//                       <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full bg-zinc-800" />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ── RIGHT — Product Info ── */}
//           <div className="flex flex-col">

//             {/* Brand */}
//             <p className="text-xs text-lime-400 font-bold uppercase tracking-[3px] mb-2">
//               {product.brand}
//             </p>

//             {/* Name */}
//             <h1 className="text-4xl font-black text-white leading-tight mb-3">
//               {product.name}
//             </h1>

//             {/* Description */}
//             <p className="text-zinc-400 text-sm leading-relaxed mb-6">
//               {product.description || "Premium quality product from " + product.brand + "."}
//             </p>

//             {/* Price */}
//             <div className="mb-1">
//               <span className="text-5xl font-black text-lime-400">
//                 ₹{product.price.toLocaleString()}
//               </span>
//             </div>
//             <p className="text-xs text-zinc-600 mb-5">
//               Inclusive of all taxes · Free shipping above ₹999
//             </p>

//             {/* Stock status */}
//             <div className="flex items-center gap-2 mb-6">
//               <span className={`w-2 h-2 rounded-full ${
//                 product.stock > 10 ? "bg-emerald-400"
//                 : product.stock > 0 ? "bg-amber-400"
//                 : "bg-red-500"}`}
//               />
//               <span className={`text-sm font-semibold ${
//                 product.stock > 10 ? "text-emerald-400"
//                 : product.stock > 0 ? "text-amber-400"
//                 : "text-red-400"}`}
//               >
//                 {product.stock > 10
//                   ? `In Stock — ${product.stock} units available`
//                   : product.stock > 0
//                   ? `Only ${product.stock} left — order soon!`
//                   : "Out of Stock"}
//               </span>
//             </div>

//             {/* ── SIZE SELECTOR ── */}
//             <div className="mb-6">
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-sm font-bold text-white">Select Size</span>
//                 {sizeError && (
//                   <span className="text-xs text-red-400 font-semibold animate-pulse">
//                     ⚠ Please select a size
//                   </span>
//                 )}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {SIZES.map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => { setSelectedSize(size); setSizeError(false); }}
//                     className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-150
//                                 ${selectedSize === size
//                                   ? "bg-lime-400 text-zinc-900 border-lime-400 scale-105 shadow-[0_0_12px_rgba(163,230,53,0.3)]"
//                                   : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-lime-400 hover:text-lime-400"
//                                 } ${sizeError ? "border-red-500/50" : ""}`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//               {selectedSize && (
//                 <p className="text-xs text-zinc-500 mt-2">
//                   Selected: <span className="text-lime-400 font-bold">{selectedSize}</span>
//                 </p>
//               )}
//             </div>

//             {/* ── QTY SELECTOR ── */}
//             <div className="flex items-center gap-4 mb-6">
//               <span className="text-sm text-zinc-400 w-16">Quantity</span>
//               <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
//                 <button
//                   onClick={() => setQty(Math.max(1, qty - 1))}
//                   className="w-10 h-10 flex items-center justify-center text-zinc-400
//                              hover:bg-zinc-800 hover:text-white transition-all"
//                 >
//                   <Minus size={14} />
//                 </button>
//                 <span className="px-5 h-10 flex items-center text-white font-bold text-sm
//                                  bg-zinc-900 border-x border-zinc-700">
//                   {qty}
//                 </span>
//                 <button
//                   onClick={() => setQty(Math.min(product.stock, qty + 1))}
//                   disabled={qty >= product.stock}
//                   className="w-10 h-10 flex items-center justify-center text-zinc-400
//                              hover:bg-zinc-800 hover:text-white transition-all
//                              disabled:opacity-30 disabled:cursor-not-allowed"
//                 >
//                   <Plus size={14} />
//                 </button>
//               </div>
//             </div>

//             {/* ── Admin actions ── */}
//             {user?.role === "admin" && (
//               <div className="flex gap-2 mb-5 pb-5 border-b border-zinc-800">
//                 <Link
//                   to={`/products/${product._id}/edit`}
//                   className="inline-flex items-center gap-1.5 text-xs border border-zinc-700
//                              text-zinc-400 hover:border-white hover:text-white
//                              px-4 py-2 rounded-lg transition-all"
//                 >
//                   <Pencil size={12} /> Edit Product
//                 </Link>
//                 <button
//                   onClick={handleDelete}
//                   disabled={deleting}
//                   className="inline-flex items-center gap-1.5 text-xs border border-red-900
//                              text-red-400 hover:bg-red-950 px-4 py-2 rounded-lg transition-all
//                              disabled:opacity-50"
//                 >
//                   <Trash2 size={12} />
//                   {deleting ? "Deleting..." : "Delete"}
//                 </button>
//               </div>
//             )}

//             {/* ── CTA buttons ── */}
//             <div className="flex gap-3 mb-6">
//               <button
//                 disabled={isOutOfStock}
//                 onClick={handleAddToCart}
//                 className={`flex-1 flex items-center justify-center gap-2
//                             font-black text-sm py-4 rounded-xl
//                             transition-all duration-150 active:scale-[0.98]
//                             ${inCart
//                               ? "bg-lime-400/20 border-2 border-lime-400 text-lime-400"
//                               : isOutOfStock
//                               ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
//                               : "bg-lime-400 hover:bg-lime-300 text-zinc-900 hover:scale-[1.02]"
//                             }`}
//               >
//                 {inCart ? (
//                   <><Check size={16} /> In Cart ({cartItem?.quantity})</>
//                 ) : (
//                   <><ShoppingCart size={16} /> Add to Cart</>
//                 )}
//               </button>

//               <button
//                 onClick={handleWishlist}
//                 className={`px-4 py-4 rounded-xl border text-lg transition-all
//                             ${isWishlisted
//                               ? "bg-red-500/20 border-red-500/50 text-red-400"
//                               : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-red-400 hover:text-red-400"
//                             }`}
//               >
//                 <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
//               </button>
//             </div>

//             {/* ── Trust badges ── */}
//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { icon: <Truck size={15} />, label: "Free Delivery", sub: "Above ₹999" },
//                 { icon: <RotateCcw size={15} />, label: "Easy Returns", sub: "7-day policy" },
//                 { icon: <ShieldCheck size={15} />, label: "Authentic", sub: "100% genuine" },
//               ].map((b) => (
//                 <div key={b.label} className="flex flex-col items-center gap-1
//                                               bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-2 text-center">
//                   <span className="text-lime-400">{b.icon}</span>
//                   <span className="text-white text-[11px] font-bold">{b.label}</span>
//                   <span className="text-zinc-500 text-[10px]">{b.sub}</span>
//                 </div>
//               ))}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;





import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct, deleteProduct } from "../api/productApi";
import { useAuth } from "../context/AuthContext";
import { addToCart, selectCartItems } from "../store/Cartslice";
import { addToWishlist, removeFromWishlist, selectWishlistItems } from "../store/wishlistSlice";
import Alert from "../components/Alert";
import {
  Heart, ShoppingCart, Check, Minus, Plus, Tag,
  Truck, RotateCcw, ShieldCheck, ChevronRight, Pencil, Trash2, ArrowLeft,
} from "lucide-react";

const SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [deleting, setDeleting] = useState(false);

  const wishlist = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);

  // ── backend stores as { product: ObjectId, ... } not { _id } ──
  const isWishlisted = wishlist.some(
    (p) => p.product?.toString() === id || p._id?.toString() === id
  );
  const cartItem = cartItems.find(
    (i) => i.product?.toString() === id || i._id?.toString() === id
  );
  const inCart = Boolean(cartItem);

  console.log("product===========>",product)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getSingleProduct(id);
        setProduct(res.data.product);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 2500);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    dispatch(addToCart({ ...product, selectedSize, quantity: qty }));
    showToast(`Added to cart — Size ${selectedSize}`);
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      showToast("Removed from wishlist", "info");
    } else {
      dispatch(addToWishlist(product));
      showToast("Saved to wishlist ♥");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product permanently?")) return;
    setDeleting(true);
    try {
      await deleteProduct(id);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
      setDeleting(false);
    }
  };

  const discountPercentage =
    product?.showPrice > product?.price
      ? Math.round(
        ((product.showPrice - product.price) / product.showPrice) * 100
      )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <Alert type="error" message={error || "Product not found."} />
        <Link to="/" className="text-lime-400 text-sm hover:underline">← Back to shop</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [null];
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* TOAST */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 font-bold text-sm px-5 py-3 rounded-xl shadow-2xl
                         flex items-center gap-2 transition-all
                         ${toast.type === "success" ? "bg-lime-400 text-zinc-900" : "bg-zinc-800 text-zinc-300 border border-zinc-700"}`}>
          <Check size={15} />
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link to="/" className="hover:text-lime-400 transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Shop
          </Link>
          <ChevronRight size={13} />
          <span className="text-zinc-400">{product.category}</span>
          <ChevronRight size={13} />
          <span className="text-white truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* LEFT — Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl aspect-square overflow-hidden relative group">
              {images[selectedImage] ? (
                <img src={images[selectedImage]} alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl opacity-10">👟</div>
              )}
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-lime-400 text-zinc-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                <Tag size={10} strokeWidth={2.5} /> {product.category}
              </span>
              {isOutOfStock && (
                <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
                  <span className="text-sm font-black text-white bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-full uppercase tracking-widest">Sold Out</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
                                ${selectedImage === i ? "border-lime-400 scale-105" : "border-zinc-700 hover:border-zinc-500"}`}>
                    {img
                      ? <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-zinc-800" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Product Info */}
          <div className="flex flex-col">
            <p className="text-xs text-lime-400 font-bold uppercase tracking-[3px] mb-2">{product.brand}</p>
            <h1 className="text-4xl font-black text-white leading-tight mb-3">{product.name}</h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {product.description || "Premium quality product from " + product.brand + "."}
            </p>

            <div className="mb-3">
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-5xl font-black text-lime-400">
                  ₹{product.price.toLocaleString()}
                </span>

                {product.showPrice > product.price && (
                  <>
                    <span className="text-2xl text-zinc-500 line-through font-semibold">
                      ₹{product.showPrice.toLocaleString()}
                    </span>

                    <span className="text-lg font-bold text-emerald-400">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {product.showPrice > product.price && (
                <p className="text-sm text-zinc-500 mt-2">
                  You save ₹
                  {(product.showPrice - product.price).toLocaleString()}
                </p>
              )}
            </div>
            <p className="text-xs text-zinc-600 mb-5">Inclusive of all taxes · Free shipping above ₹999</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? "bg-emerald-400" : product.stock > 0 ? "bg-amber-400" : "bg-red-500"
                }`} />
              <span className={`text-sm font-semibold ${product.stock > 10 ? "text-emerald-400" : product.stock > 0 ? "text-amber-400" : "text-red-400"
                }`}>
                {product.stock > 10
                  ? `In Stock — ${product.stock} units available`
                  : product.stock > 0
                    ? `Only ${product.stock} left — order soon!`
                    : "Out of Stock"}
              </span>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">Select Size</span>
                {sizeError && (
                  <span className="text-xs text-red-400 font-semibold animate-pulse">⚠ Please select a size</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-150
                                ${selectedSize === size
                        ? "bg-lime-400 text-zinc-900 border-lime-400 scale-105 shadow-[0_0_12px_rgba(163,230,53,0.3)]"
                        : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-lime-400 hover:text-lime-400"
                      } ${sizeError ? "border-red-500/50" : ""}`}>
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-xs text-zinc-500 mt-2">
                  Selected: <span className="text-lime-400 font-bold">{selectedSize}</span>
                </p>
              )}
            </div>

            {/* Qty Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-zinc-400 w-16">Quantity</span>
              <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                  <Minus size={14} />
                </button>
                <span className="px-5 h-10 flex items-center text-white font-bold text-sm bg-zinc-900 border-x border-zinc-700">
                  {qty}
                </span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} disabled={qty >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Admin actions */}
            {user?.role === "admin" && (
              <div className="flex gap-2 mb-5 pb-5 border-b border-zinc-800">
                <Link to={`/products/${product._id}/edit`}
                  className="inline-flex items-center gap-1.5 text-xs border border-zinc-700 text-zinc-400 hover:border-white hover:text-white px-4 py-2 rounded-lg transition-all">
                  <Pencil size={12} /> Edit Product
                </Link>
                <button onClick={handleDelete} disabled={deleting}
                  className="inline-flex items-center gap-1.5 text-xs border border-red-900 text-red-400 hover:bg-red-950 px-4 py-2 rounded-lg transition-all disabled:opacity-50">
                  <Trash2 size={12} />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 mb-6">
              <button disabled={isOutOfStock} onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-black text-sm py-4 rounded-xl
                            transition-all duration-150 active:scale-[0.98]
                            ${inCart
                    ? "bg-lime-400/20 border-2 border-lime-400 text-lime-400"
                    : isOutOfStock
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                      : "bg-lime-400 hover:bg-lime-300 text-zinc-900 hover:scale-[1.02]"
                  }`}>
                {inCart
                  ? <><Check size={16} /> In Cart ({cartItem?.quantity})</>
                  : <><ShoppingCart size={16} /> Add to Cart</>}
              </button>

              <button onClick={handleWishlist}
                className={`px-4 py-4 rounded-xl border text-lg transition-all
                            ${isWishlisted
                    ? "bg-red-500/20 border-red-500/50 text-red-400"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-red-400 hover:text-red-400"
                  }`}>
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: <Truck size={15} />, label: "Free Delivery", sub: "Above ₹999" },
                { icon: <RotateCcw size={15} />, label: "Easy Returns", sub: "7-day policy" },
                { icon: <ShieldCheck size={15} />, label: "Authentic", sub: "100% genuine" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-2 text-center">
                  <span className="text-lime-400">{b.icon}</span>
                  <span className="text-white text-[11px] font-bold">{b.label}</span>
                  <span className="text-zinc-500 text-[10px]">{b.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;