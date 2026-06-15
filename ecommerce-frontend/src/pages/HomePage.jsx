import { useState, useEffect } from "react";
import { getAllProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import Alert from "../components/Alert";
import shoesImg from "../assets/Shoes.png";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// ── STAT ITEM ─────────────────────────────────────────────────────────────────
function StatItem({ end, suffix, label }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <div ref={ref}>
      <h3 className="text-2xl sm:text-3xl font-bold text-white">
        {inView ? (
          <CountUp end={end} duration={2} suffix={suffix} separator="," />
        ) : (
          <span>0{suffix}</span>
        )}
      </h3>
      <p className="text-zinc-500 text-xs sm:text-sm">{label}</p>
    </div>
  );
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Shoes", "Slippers", "Formal", "Boot"];

const CATEGORY_ICONS = {
  All: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  Shoes: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18h1.4c.3 0 .6-.2.8-.5l1.7-3.2A2 2 0 0 1 7.6 13h5.5c.8 0 1.5.4 1.9 1l1.4 2.1A2 2 0 0 0 18 17h3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2v-1Z"/>
      <path d="M7.6 13 6 7H4" />
    </svg>
  ),
  Slippers: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16s1-1 4-1 6 2 8 2 4-1 4-1v-5s-1 1-4 1-6-2-8-2-4 1-4 1Z"/>
      <path d="M4 16v3" /><path d="M20 16v3" />
    </svg>
  ),
  Apparel: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  ),
  Accessories: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <line x1="3" x2="21" y1="6" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
};

// ── PAGE ──────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data.products);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* LEFT */}
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-lime-400/20 bg-lime-400/10 text-lime-400 text-xs sm:text-sm font-medium mb-6">
                New Season Collection 2026
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95]">
                Discover
                <br />
                Premium
                <br />
                <span className="text-lime-400">Streetwear</span>
              </h1>

              <p className="mt-6 text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl">
                Shop the latest sneakers, apparel, and accessories from the
                world's leading brands. Built for comfort, performance, and
                everyday confidence.
              </p>

              <div className="flex gap-3 sm:gap-4 mt-8">
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-lime-400 text-black font-bold rounded-xl hover:scale-105 transition text-sm sm:text-base">
                  Shop Now
                </button>
                <button className="px-6 sm:px-8 py-3 sm:py-4 border border-zinc-700 text-white rounded-xl hover:border-lime-400 transition text-sm sm:text-base">
                  Explore
                </button>
              </div>

              {/* SEARCH */}
              <div className="mt-8 max-w-lg relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shoes, apparel, brands..."
                  className="
                    w-full bg-zinc-900 border border-zinc-700 text-white
                    rounded-xl pl-11 pr-5 py-3 sm:py-4 outline-none text-sm sm:text-base
                    focus:border-lime-400 transition placeholder:text-zinc-600
                  "
                />
              </div>

              {/* STATS ── react-countup */}
              <div className="flex gap-8 sm:gap-12 mt-10">
                <StatItem end={500}   suffix="+"  label="Products"  />
                <StatItem end={50}    suffix="+"  label="Brands"    />
                <StatItem end={10000} suffix="+"  label="Customers" />
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="absolute w-[450px] h-[550px] bg-lime-400/20 blur-[140px] rounded-full" />
              <img
                src={shoesImg}
                alt="Sneaker"
                className="relative z-10 w-full max-w-xl rounded-3xl shadow-2xl hover:scale-105 transition-all duration-500"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">

        {error && (
          <div className="mb-6 mt-8">
            <Alert type="error" message={error} />
          </div>
        )}

        {/* ── CATEGORY FILTER BAR ── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-10 pb-6">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5
                  rounded-full text-xs sm:text-sm font-semibold border
                  transition-all duration-150 select-none
                  ${isActive
                    ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_16px_rgba(163,230,53,0.25)]"
                    : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-lime-400 hover:text-lime-400"
                  }
                `}
              >
                <span className={isActive ? "text-black" : "text-zinc-500"}>
                  {CATEGORY_ICONS[cat]}
                </span>
                {cat}
                <span
                  className={`
                    ml-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold leading-none
                    ${isActive
                      ? "bg-black/20 text-black"
                      : "bg-zinc-800 text-zinc-500"
                    }
                  `}
                >
                  {cat === "All"
                    ? products.length
                    : products.filter(
                        (p) => p.category.toLowerCase() === cat.toLowerCase()
                      ).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── PRODUCT GRID ── */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-zinc-700 border-t-lime-400 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">👟</p>
            <p className="text-zinc-500 text-base sm:text-lg">
              No {selectedCategory !== "All" ? selectedCategory.toLowerCase() : "products"} found
              {search && ` for "${search}"`}
            </p>
            {(search || selectedCategory !== "All") && (
              <button
                onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                className="mt-4 text-lime-400 text-sm underline underline-offset-4 hover:text-lime-300 transition"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedCategory === "All" ? "Trending Products" : selectedCategory}
                </h2>
                {selectedCategory !== "All" && (
                  <span className="px-2.5 py-1 bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-semibold rounded-full">
                    filtered
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-xs sm:text-sm">{filtered.length} products</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;