import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    // UI-only: backend email integration can plug in later.
    setSent(true);
    toast.success("If that email exists, we sent a reset link.");
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
        <h1 className="text-2xl font-extrabold text-center">Forgot password?</h1>
        <p className="text-sm text-slate-500 mt-1 text-center">We'll email you a reset link.</p>

        {sent ? (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">
            Check your inbox for a reset link.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Email</span>
              <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-primary-500">
                <FiMail className="text-slate-400" />
                <input required type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 outline-none bg-transparent" placeholder="you@email.com" />
              </div>
            </label>
            <button className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold">
              Send reset link
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="text-primary-600 font-semibold">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
