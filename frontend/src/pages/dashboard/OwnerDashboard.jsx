import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiBookOpen, FiStar, FiPlusSquare } from "react-icons/fi";
import { propertyService } from "../../services/propertyService";
import { bookingService } from "../../services/bookingService";
import { formatPrice } from "../../utils/helpers";

export default function OwnerDashboard() {
  const [props, setProps] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    propertyService.mine().then(setProps).catch(() => {});
    bookingService.owner().then(setBookings).catch(() => {});
  }, []);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const avgRating =
    props.length > 0 ? (props.reduce((s, p) => s + (p.rating || 0), 0) / props.length).toFixed(1) : "0.0";

  const cards = [
    { icon: FiHome, label: "Listings", value: props.length, color: "bg-primary-600" },
    { icon: FiBookOpen, label: "Bookings", value: bookings.length, color: "bg-emerald-600" },
    { icon: FiStar, label: "Avg Rating", value: avgRating, color: "bg-amber-500" },
    { icon: FiPlusSquare, label: "Pending", value: pending, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-extrabold">Owner Dashboard</h1>
        <Link to="/dashboard/owner/add"
          className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2">
          <FiPlusSquare /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{c.label}</p>
              <span className={`w-9 h-9 rounded-lg grid place-items-center text-white ${c.color}`}>
                <c.icon />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold">{c.value}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">My Properties</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {props.length === 0 && <p className="text-slate-500">You haven't listed any properties yet.</p>}
          {props.map((p) => (
            <Link key={p.id} to={`/properties/${p.id}`}
              className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden hover:shadow-glow transition">
              <img src={p.images?.[0] || "https://placehold.co/300x200"} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="font-semibold line-clamp-1">{p.title}</p>
                <p className="text-xs text-slate-500">{p.location}</p>
                <p className="mt-1 text-primary-700 font-bold text-sm">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
