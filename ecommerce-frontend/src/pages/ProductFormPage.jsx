import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createProduct,
  getSingleProduct,
  updateProduct,
} from "../api/productApi";
import InputField from "../components/InputField";
import Alert from "../components/Alert";

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    showPrice: "",
    category: "",
    brand: "",
    stock: "",
    images: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const res = await getSingleProduct(id);
        const p = res.data.product;

        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          showPrice: p.showPrice || "",
          category: p.category || "",
          brand: p.brand || "",
          stock: p.stock || "",
          images: p.images?.join(", ") || "",
        });
      } catch (error) {
        setError("Failed to load product.");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      price: Number(form.price),
      showPrice: Number(form.showPrice),
      stock: Number(form.stock),
      images: form.images
        ? form.images
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);

        setSuccess("Product updated successfully!");

        setTimeout(() => {
          navigate(`/products/${id}`);
        }, 1200);
      } else {
        const res = await createProduct(payload);

        setSuccess("Product created successfully!");

        setTimeout(() => {
          navigate(`/products/${res.data.product._id}`);
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-lime-400 text-sm font-medium hover:text-lime-300 transition-colors"
          >
            ← Back to shop
          </Link>

          <h1 className="mt-6 text-4xl font-black text-white font-display tracking-tight leading-none">
            {isEdit ? "Edit" : "Add New"}
            <br />
            <span className="text-lime-400">Product.</span>
          </h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <form
            onSubmit={handleSubmit}
            className="mt-2 flex flex-col gap-4"
          >
            <InputField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Nike Air Max"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400 font-medium">
                Description{" "}
                <span className="text-lime-400">*</span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product..."
                rows={3}
                required
                className="
                  bg-zinc-900 border border-zinc-700 text-white
                  placeholder:text-zinc-600 text-sm rounded-lg
                  px-4 py-3 outline-none resize-none
                  focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30
                  transition-all
                "
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Price (₹)"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="4999"
                required
              />

              <InputField
                label="Show Price (₹)"
                type="number"
                name="showPrice"
                value={form.showPrice}
                onChange={handleChange}
                placeholder="5999"
                required
              />

              <InputField
                label="Stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Shoes"
                required
              />

              <InputField
                label="Brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Nike"
                required
              />
            </div>

            <InputField
              label="Image URLs (comma-separated)"
              name="images"
              value={form.images}
              onChange={handleChange}
              placeholder="image1.jpg, image2.jpg"
            />

            <button
              type="submit"
              disabled={loading}
              className="
                mt-2 w-full bg-lime-400 text-zinc-900 font-black text-sm
                py-3.5 rounded-xl hover:bg-lime-300 active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                tracking-wide
              "
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Product →"
                : "Create Product →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;