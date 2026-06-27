import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { propertyService } from "../../services/propertyService";
import { formatPrice } from "../../utils/helpers";

export default function ManageProperties() {
  const [items, setItems] = useState([]);

  const load = () => propertyService.mine().then(setItems).catch(() => {});
  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm("Delete this property?")) return;
    try {
      await propertyService.remove(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Could not delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">My Properties</h1>
        <Link to="/dashboard/owner/add" className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold">
          + Add New
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <p className="text-slate-500">No listings yet.</p>}
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
            <Link to={`/properties/${p.id}`}>
              <img src={p.images?.[0] || "https://placehold.co/300x200"} className="w-full h-36 object-cover" />
            </Link>
            <div className="p-4">
              <p className="font-semibold line-clamp-1">{p.title}</p>
              <p className="text-xs text-slate-500">{p.location}, {p.city}</p>
              <p className="mt-1 text-primary-700 font-bold">{formatPrice(p.price)}</p>
              <div className="mt-3 flex gap-2">
                <Link to={`/dashboard/owner/edit/${p.id}`} className="flex-1 text-center px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm flex items-center justify-center gap-1">
                  <FiEdit2 /> Edit
                </Link>
                <button onClick={() => remove(p.id)} className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-sm flex items-center gap-1">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
