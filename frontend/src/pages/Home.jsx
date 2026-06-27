import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProperties from "../components/FeaturedProperties";
import Testimonials from "../components/Testimonials";
import { motion } from "framer-motion";
import { FiShield, FiDollarSign, FiTrendingUp } from "react-icons/fi";

const features = [
  { icon: FiShield, title: "Verified Listings", text: "Every owner and property is verified by our team." },
  { icon: FiDollarSign, title: "Zero Brokerage", text: "Save thousands — no middlemen, no hidden fees." },
  { icon: FiTrendingUp, title: "Smart Recommendations", text: "AI suggests rooms tailored to your lifestyle." },
];

export default function Home() {
  return (
    <>
      <Hero />
      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white border border-slate-100 shadow-soft"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 grid place-items-center text-xl">
              <f.icon />
            </div>
            <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
            <p className="mt-1 text-slate-500">{f.text}</p>
          </motion.div>
        ))}
      </section>
      <Categories />
      <FeaturedProperties />
      <Testimonials />
    </>
  );
}
