import { useEffect, useState } from "react";
import { wishlistService } from "../services/userService";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    wishlistService
      .list()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (p) => {
    try {
      await wishlistService.remove(p.id);
      setItems((arr) => arr.filter((x) => x.id !== p.id));
      toast.success("Removed");
    } catch {
      toast.error("Could not remove");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold">My Wishlist</h1>
      <p className="text-slate-500 mt-1">{items.length} saved properties</p>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="mt-10 text-center py-20 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500">No saved properties yet.</p>
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} onWishlist={remove} wishlisted />
          ))}
        </div>
      )}
    </div>
  );
}
