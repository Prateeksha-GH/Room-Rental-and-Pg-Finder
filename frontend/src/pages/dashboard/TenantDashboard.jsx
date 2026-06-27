import { useEffect, useState } from "react";
import { FiBookOpen, FiHeart, FiBell } from "react-icons/fi";
import { bookingService } from "../../services/bookingService";
import { wishlistService, notificationService } from "../../services/userService";
import { formatDate, formatPrice } from "../../utils/helpers";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className={`w-9 h-9 rounded-lg grid place-items-center text-white ${color}`}>
          <Icon />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

export default function TenantDashboard() {
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    bookingService.my().then(setBookings).catch(() => {});
    wishlistService.list().then(setWishlist).catch(() => {});
    notificationService.list().then(setNotifs).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold">Tenant Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={FiBookOpen} label="Bookings" value={bookings.length} color="bg-primary-600" />
        <StatCard icon={FiHeart} label="Saved" value={wishlist.length} color="bg-rose-500" />
        <StatCard icon={FiBell} label="Notifications" value={notifs.length} color="bg-amber-500" />
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Bookings</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          {bookings.length === 0 ? (
            <p className="p-6 text-slate-500">No bookings yet — go book your first visit!</p>
          ) : (
            <div className="divide-y">
              {bookings.slice(0, 6).map((b) => (
                <div key={b.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={b.property?.images?.[0] || "https://placehold.co/100x80"}
                      className="w-16 h-14 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{b.property?.title}</p>
                      <p className="text-sm text-slate-500">Visit: {formatDate(b.visit_date)} · {formatPrice(b.property?.price)}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                    b.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                    b.status === "rejected" ? "bg-rose-100 text-rose-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Notifications</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          {notifs.length === 0 ? (
            <p className="p-6 text-slate-500">All caught up!</p>
          ) : (
            <div className="divide-y">
              {notifs.slice(0, 5).map((n) => (
                <div key={n.id} className="p-4">
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-slate-600">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(n.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
