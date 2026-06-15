import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import Alert from "../components/Alert";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      setUser(res.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background Effects */}
      <div className="absolute top-[-150px] left-[-100px] w-96 h-96 bg-lime-400/20 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-150px] right-[-100px] w-96 h-96 bg-green-500/20 rounded-full blur-[140px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link
          to="/"
          className="
            inline-flex items-center gap-2
            text-zinc-400 hover:text-lime-400
            transition-colors duration-300
            mb-8
          "
        >
          ← Back to shop
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-lime-400 font-semibold mb-3">
            Welcome Back
          </span>

          <h1
            className="
              text-5xl md:text-6xl
              font-black
              leading-none
              bg-gradient-to-r
              from-lime-300
              via-lime-400
              to-green-500
              bg-clip-text
              text-transparent
            "
          >
            Sign In
          </h1>

          <p className="mt-4 text-zinc-400 text-base">
            Continue your shopping journey with us 
          </p>
        </div>

        {/* Login Card */}
        <div
          className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-3xl
            p-8
            shadow-[0_0_40px_rgba(163,230,53,0.15)]
          "
        >
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 mt-4"
          >
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="
                mt-2
                w-full
                py-4
                rounded-2xl
                font-bold
                text-black
                bg-gradient-to-r
                from-lime-300
                via-lime-400
                to-green-400
                shadow-lg
                shadow-lime-500/30
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all
                duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          {/* Register */}
          <p className="mt-6 text-center text-zinc-400">
            New here?{" "}
            <Link
              to="/register"
              className="
                text-lime-400
                font-semibold
                hover:text-lime-300
                transition-colors
              "
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-600">
          Secure login powered by modern authentication
        </p>
      </div>
    </div>
  );
};

export default LoginPage;