import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { bookingService } from "../../services/bookingService";
import { formatDate, formatPrice } from "../../utils/helpers";

export default function TenantBookings() {
  const [items, setItems] = useState([]);

  const load = () => bookingService.my().then(setItems).catch(() => {});
  useEffect(load, []);

  const cancel = async (id) => {
    try {
      await bookingService.update(id, { status: "cancelled" });
      toast.success("Booking cancelled");
      load();
    } catch {
      toast.error("Could not cancel");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold">My Bookings</h1>
      <div className="mt-6 grid gap-3">
        {items.length === 0 && (
          <p className="text-slate-500">No bookings yet.</p>
        )}
        {items.map((b) => (
          <div key={b.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-soft flex flex-col md:flex-row gap-4 items-start md:items-center">
            <img src={b.property?.images?.[0] || "https://placehold.co/120x100"}
              className="w-full md:w-32 h-24 object-cover rounded-xl" />
            <div className="flex-1 min-w-0">
              <Link to={`/properties/${b.property?.id}`} className="font-semibold hover:text-primary-600">
                {b.property?.title}
              </Link>
              <p className="text-sm text-slate-500">{b.property?.location}, {b.property?.city}</p>
              <p className="text-sm mt-1">Visit Date: <span className="font-semibold">{formatDate(b.visit_date)}</span></p>
              <p className="text-sm">Rent: <span className="font-semibold">{formatPrice(b.property?.price)}</span></p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                b.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                b.status === "rejected" ? "bg-rose-100 text-rose-700" :
                b.status === "cancelled" ? "bg-slate-200 text-slate-700" :
                "bg-amber-100 text-amber-700"
              }`}>{b.status}</span>
              {b.status === "pending" && (
                <button onClick={() => cancel(b.id)} className="text-xs text-rose-600 hover:underline">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
