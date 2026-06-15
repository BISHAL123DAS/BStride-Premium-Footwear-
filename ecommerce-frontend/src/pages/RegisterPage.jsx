import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import Alert from "../components/Alert";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const res = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setUser(res.data.user);
      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background Glow */}
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
            Join The Community
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
            Create
            <br />
            Account.
          </h1>

          <p className="mt-4 text-zinc-400 text-base">
            Create your account and start shopping today
          </p>
        </div>

        {/* Card */}
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
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe"
              required
            />

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
              placeholder="Minimum 6 characters"
              required
            />

            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
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
              {loading
                ? "Creating Account..."
                : "Create Account →"}
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

          {/* Login Link */}
          <p className="mt-6 text-center text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="
                text-lime-400
                font-semibold
                hover:text-lime-300
                transition-colors
              "
            >
              Sign In →
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-600">
          Secure registration with modern authentication
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;