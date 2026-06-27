import { useEffect, useState } from "react";
import { FiUsers, FiHome, FiBookOpen, FiStar } from "react-icons/fi";
import { adminService } from "../../services/userService";

const cards = [
  { key: "users", icon: FiUsers, label: "Total Users", color: "bg-primary-600" },
  { key: "properties", icon: FiHome, label: "Listings", color: "bg-emerald-600" },
  { key: "bookings", icon: FiBookOpen, label: "Bookings", color: "bg-amber-500" },
  { key: "reviews", icon: FiStar, label: "Reviews", color: "bg-rose-500" },
];

function BarRow({ label, value, max }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2 mt-1 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-500 to-accent-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    adminService.stats().then(setStats).catch(() => {});
  }, []);

  const max = Math.max(stats.tenants || 0, stats.owners || 0, 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.key} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{c.label}</p>
              <span className={`w-9 h-9 rounded-lg grid place-items-center text-white ${c.color}`}>
                <c.icon />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold">{stats[c.key] ?? "—"}</p>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
        <h2 className="font-semibold text-lg mb-4">User Breakdown</h2>
        <div className="space-y-4">
          <BarRow label="Tenants" value={stats.tenants || 0} max={max} />
          <BarRow label="Owners" value={stats.owners || 0} max={max} />
        </div>
      </section>
    </div>
  );
}
