import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { adminService } from "../../services/userService";
import { formatPrice } from "../../utils/helpers";

export default function AdminProperties() {
  const [items, setItems] = useState([]);

  const load = () => adminService.properties().then(setItems).catch(() => {});
  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm("Remove this listing?")) return;
    try {
      await adminService.removeProperty(id);
      toast.success("Removed");
      load();
    } catch {
      toast.error("Could not remove");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold">All Listings</h1>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <p className="text-slate-500">No properties yet.</p>}
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
            <Link to={`/properties/${p.id}`}>
              <img src={p.images?.[0] || "https://placehold.co/300x200"} className="w-full h-36 object-cover" />
            </Link>
            <div className="p-4">
              <p className="font-semibold line-clamp-1">{p.title}</p>
              <p className="text-xs text-slate-500">{p.city}</p>
              <p className="mt-1 text-primary-700 font-bold">{formatPrice(p.price)}</p>
              <button onClick={() => remove(p.id)}
                className="mt-3 w-full px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-sm flex items-center justify-center gap-1">
                <FiTrash2 /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
