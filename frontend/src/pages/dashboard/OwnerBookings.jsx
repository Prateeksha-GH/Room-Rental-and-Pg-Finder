import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { bookingService } from "../../services/bookingService";
import { formatDate } from "../../utils/helpers";

export default function OwnerBookings() {
  const [items, setItems] = useState([]);

  const load = () => bookingService.owner().then(setItems).catch(() => {});
  useEffect(load, []);

  const setStatus = async (b, status) => {
    try {
      await bookingService.update(b.id, { status });
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold">Booking Requests</h1>
      <div className="mt-6 grid gap-3">
        {items.length === 0 && <p className="text-slate-500">No booking requests yet.</p>}
        {items.map((b) => (
          <div key={b.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-soft flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1">
              <p className="font-semibold">{b.property?.title}</p>
              <p className="text-sm text-slate-500">From: {b.tenant?.name} ({b.tenant?.email})</p>
              <p className="text-sm">Visit: {formatDate(b.visit_date)}</p>
              {b.message && <p className="text-sm mt-1 italic text-slate-600">"{b.message}"</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                b.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                b.status === "rejected" ? "bg-rose-100 text-rose-700" :
                b.status === "cancelled" ? "bg-slate-200 text-slate-700" :
                "bg-amber-100 text-amber-700"
              }`}>{b.status}</span>
              {b.status === "pending" && (
                <>
                  <button onClick={() => setStatus(b, "approved")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                    Approve
                  </button>
                  <button onClick={() => setStatus(b, "rejected")}
                    className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-sm font-semibold hover:bg-rose-200">
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
