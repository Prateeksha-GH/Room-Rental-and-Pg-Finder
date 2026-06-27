import { motion } from "framer-motion";
import { FiShield, FiHeart, FiTrendingUp, FiUsers, FiMapPin, FiAward } from "react-icons/fi";

const values = [
  { icon: FiShield, title: "Verified first", text: "Every owner and listing passes a manual check before going live." },
  { icon: FiHeart, title: "Tenant-friendly", text: "Zero brokerage, transparent pricing, and a strong dispute policy." },
  { icon: FiTrendingUp, title: "Built to scale", text: "From a single PG to multi-city portfolios — same simple workflow." },
];

const stats = [
  { value: "10,000+", label: "Verified rooms" },
  { value: "20+", label: "Cities covered" },
  { value: "98%", label: "Tenant satisfaction" },
  { value: "0%", label: "Brokerage" },
];

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
          About RoomNest
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
          Helping renters find a{" "}
          <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            place to call home
          </span>
        </h1>
        <p className="mt-5 text-lg text-slate-600">
          RoomNest connects tenants with verified PGs, hostels, and rental flats across India.
          We replace opaque brokers with real photos, clear pricing, and direct conversations
          between owners and renters.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-soft text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-primary-600">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-16 grid md:grid-cols-3 gap-5">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl bg-white border border-slate-100 shadow-soft"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 grid place-items-center text-xl">
              <v.icon />
            </div>
            <h3 className="mt-4 font-semibold text-lg">{v.title}</h3>
            <p className="mt-1 text-slate-500">{v.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="mt-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold">Our story</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            RoomNest started after our founders spent a frustrating month chasing brokers,
            fake listings, and unanswered calls while trying to find a simple shared PG. We
            built the tool we wished existed — one where every property is verified, every
            owner is reachable, and every price is the price you actually pay.
          </p>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Today we work with thousands of independent owners and co-living operators to
            give renters a clean, honest way to find their next room.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-100">
            <FiUsers className="text-primary-600 text-2xl" />
            <div className="mt-3 font-semibold">Community-led</div>
            <p className="text-sm text-slate-500 mt-1">
              Reviews and ratings come from real tenants, not paid placements.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100">
            <FiMapPin className="text-orange-500 text-2xl" />
            <div className="mt-3 font-semibold">Local on the ground</div>
            <p className="text-sm text-slate-500 mt-1">
              City teams verify properties in person before they go live.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
            <FiAward className="text-emerald-600 text-2xl" />
            <div className="mt-3 font-semibold">Trusted</div>
            <p className="text-sm text-slate-500 mt-1">
              Owners are KYC-verified and listings are re-checked every quarter.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100">
            <FiHeart className="text-rose-500 text-2xl" />
            <div className="mt-3 font-semibold">Tenant-first</div>
            <p className="text-sm text-slate-500 mt-1">
              No brokerage, no hidden fees, no spammy callbacks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
