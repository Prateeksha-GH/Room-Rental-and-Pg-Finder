import { useEffect, useState } from "react";
import { propertyService } from "../services/propertyService";
import PropertyCard from "./PropertyCard";
import Loader from "./Loader";
import { Link } from "react-router-dom";

export default function FeaturedProperties() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService
      .featured()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold">Featured properties</h2>
          <p className="mt-2 text-slate-500">Top-rated rooms picked just for you</p>
        </div>
        <Link to="/properties" className="hidden md:inline text-sm font-semibold text-primary-600 hover:text-primary-800">
          View all →
        </Link>
      </div>
      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="text-slate-500">No properties yet. Run the seed script to populate sample data.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </section>
  );
}
