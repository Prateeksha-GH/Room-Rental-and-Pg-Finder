import { motion } from "framer-motion";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.4),transparent_45%)]" />

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur text-sm font-medium border border-white/20">
            🏡 10,000+ verified rooms across India
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight">
            Find your perfect{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-pink-200 bg-clip-text text-transparent">
              PG &amp; rental
            </span>{" "}
            in minutes.
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-2xl">
            Browse curated PGs, hostels and flats with real photos, transparent pricing, verified
            owners and zero brokerage.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 bg-white/95 backdrop-blur p-2 md:p-3 rounded-2xl shadow-glow grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2"
        >
          <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50">
            <FiSearch className="text-slate-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="PG name, location..."
              className="bg-transparent flex-1 outline-none text-slate-800" />
          </label>
          <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50">
            <FiMapPin className="text-slate-500" />
            <input value={city} onChange={(e) => setCity(e.target.value)}
              placeholder="City (Bangalore, Pune...)"
              className="bg-transparent flex-1 outline-none text-slate-800" />
          </label>
          <button className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition">
            Search
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {["Bangalore", "Pune", "Mumbai", "Delhi", "Hyderabad"].map((c) => (
            <button
              key={c}
              onClick={() => navigate(`/properties?city=${c}`)}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm transition"
            >
              {c}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
