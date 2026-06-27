import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const items = [
  {
    name: "Aarav Sharma", role: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=11",
    text: "Booked my PG in under 10 minutes. Real photos, no broker fees — RoomNest delivered.",
  },
  {
    name: "Sneha Iyer", role: "Marketing Lead",
    avatar: "https://i.pravatar.cc/150?img=47",
    text: "The filters are perfect. Found a furnished AC room with food included near my office.",
  },
  {
    name: "Karthik Reddy", role: "PG Owner",
    avatar: "https://i.pravatar.cc/150?img=33",
    text: "Listing my property took 2 minutes. I now get high-intent tenant requests every week.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">Loved by thousands</h2>
          <p className="mt-2 text-slate-500">What our tenants and owners say about RoomNest</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mt-3 text-amber-500">
                {Array.from({ length: 5 }).map((_, n) => <FiStar key={n} className="fill-current" />)}
              </div>
              <p className="mt-3 text-slate-700">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
