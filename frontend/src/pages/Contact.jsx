import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

const channels = [
  { icon: FiMail, label: "Email", value: "support@roomnest.com", href: "mailto:support@roomnest.com" },
  { icon: FiPhone, label: "Phone", value: "+91 80 4000 0000", href: "tel:+918040000000" },
  { icon: FiMapPin, label: "Office", value: "Koramangala, Bangalore 560034", href: null },
  { icon: FiClock, label: "Hours", value: "Mon–Sat, 10:00 – 19:00 IST", href: null },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    setSending(true);
    // No backend endpoint yet — simulate send and let the user know we've received it.
    setTimeout(() => {
      toast.success("Thanks! We'll get back to you within 1 business day.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
          Contact us
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
          We'd love to hear from you
        </h1>
        <p className="mt-4 text-slate-600">
          Questions about a listing, an owner partnership, or feedback on the product — drop
          us a line and we'll usually reply within a business day.
        </p>
      </motion.div>

      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {channels.map((c) => (
            <div key={c.label} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-soft">
              <span className="w-11 h-11 rounded-xl bg-primary-100 text-primary-700 grid place-items-center text-lg shrink-0">
                <c.icon />
              </span>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{c.label}</div>
                {c.href ? (
                  <a href={c.href} className="text-slate-800 font-medium hover:text-primary-600 break-all">
                    {c.value}
                  </a>
                ) : (
                  <div className="text-slate-800 font-medium">{c.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={submit}
          className="p-6 md:p-8 rounded-2xl bg-white border border-slate-100 shadow-soft space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Your name</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jane Doe"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@email.com"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              placeholder="How can we help?"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              rows={5}
              placeholder="Tell us a bit about what you need…"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 resize-y"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold transition"
          >
            <FiSend /> {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
