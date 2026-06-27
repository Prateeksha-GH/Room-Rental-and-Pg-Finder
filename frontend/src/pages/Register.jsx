import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/helpers";

export default function Register() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", role: "tenant",
  });
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      const u = await register(form);
      toast.success("Account created!");
      navigate(dashboardPathFor(u.role), { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-soft p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">Join thousands finding their perfect room</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { value: "tenant", label: "Tenant", emoji: "🙋" },
            { value: "owner", label: "Owner", emoji: "🏠" },
            { value: "admin", label: "Admin", emoji: "🛡️" },
          ].map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setForm({ ...form, role: r.value })}
              className={`py-3 rounded-xl border-2 text-sm font-semibold transition ${
                form.role === r.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="text-xl">{r.emoji}</div>
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Full Name</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-primary-500">
              <FiUser className="text-slate-400" />
              <input required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="flex-1 outline-none bg-transparent" placeholder="Your name" />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Email</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-primary-500">
              <FiMail className="text-slate-400" />
              <input required type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="flex-1 outline-none bg-transparent" placeholder="you@email.com" />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Phone</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-primary-500">
              <FiPhone className="text-slate-400" />
              <input value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="flex-1 outline-none bg-transparent" placeholder="+91-9XXXXXXXXX" />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Password</span>
              <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-primary-500">
                <FiLock className="text-slate-400" />
                <input required type="password" minLength={6} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="flex-1 outline-none bg-transparent" placeholder="min 6 chars" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Confirm</span>
              <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-primary-500">
                <FiLock className="text-slate-400" />
                <input required type="password" value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="flex-1 outline-none bg-transparent" placeholder="repeat" />
              </div>
            </label>
          </div>

          <button disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-60">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-semibold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
