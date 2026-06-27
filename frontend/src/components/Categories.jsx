import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBuilding, FaHotel, FaHome, FaWarehouse } from "react-icons/fa";

const cats = [
  { key: "pg", label: "PG Rooms", icon: FaBuilding, color: "from-primary-500 to-primary-700" },
  { key: "hostel", label: "Hostels", icon: FaHotel, color: "from-emerald-500 to-emerald-700" },
  { key: "rental", label: "Rental Rooms", icon: FaWarehouse, color: "from-amber-500 to-orange-600" },
  { key: "flat", label: "Flats", icon: FaHome, color: "from-rose-500 to-pink-600" },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold">Browse by category</h2>
        <p className="mt-2 text-slate-500">Pick what fits your lifestyle and budget</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/properties?category=${c.key}`}
              className="group block p-6 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-glow transition"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} text-white grid place-items-center text-xl`}>
                <c.icon />
              </div>
              <h3 className="mt-4 font-semibold">{c.label}</h3>
              <p className="text-sm text-slate-500 mt-1">Explore options →</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
