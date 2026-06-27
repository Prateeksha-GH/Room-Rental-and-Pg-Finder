import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/helpers";

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const u = await login(form);
      toast.success(`Welcome back, ${u.name}!`);
      const dest = location.state?.from?.pathname || dashboardPathFor(u.role);
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-soft p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to continue your search</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Email</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-primary-500">
              <FiMail className="text-slate-400" />
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
                className="flex-1 outline-none bg-transparent" />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Password</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-primary-500">
              <FiLock className="text-slate-400" />
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="flex-1 outline-none bg-transparent" />
            </div>
          </label>

          <div className="flex justify-between text-sm">
            <span />
            <Link to="/forgot-password" className="text-primary-600 hover:text-primary-800">
              Forgot password?
            </Link>
          </div>

          <button disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          New to RoomNest?{" "}
          <Link to="/register" className="text-primary-600 font-semibold">Create an account</Link>
        </p>

        <div className="mt-6 p-3 rounded-xl bg-slate-50 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">Demo accounts</p>
          <p>tenant@roomnest.com / tenant123</p>
          <p>owner@roomnest.com / owner123</p>
          <p>admin@roomnest.com / admin123</p>
        </div>
      </motion.div>
    </div>
  );
}
