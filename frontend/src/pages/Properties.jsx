import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { propertyService } from "../services/propertyService";
import { wishlistService } from "../services/userService";
import PropertyCard from "../components/PropertyCard";
import Filters from "../components/Filters";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const filters = Object.fromEntries(searchParams.entries());
  const page = parseInt(filters.page || "1", 10);

  useEffect(() => {
    setLoading(true);
    // Build API params: drop empties, coerce booleans/numbers, send page.
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v === "" || v === undefined || v === null) return;
      if (["food_included", "ac", "wifi", "furnished"].includes(k)) {
        if (v === "true" || v === true) params[k] = true;
      } else if (["min_price", "max_price"].includes(k)) {
        const n = Number(v);
        if (!Number.isNaN(n)) params[k] = n;
      } else {
        params[k] = v;
      }
    });
    params.page = page;
    params.limit = 12;
    propertyService
      .list(params)
      .then(setData)
      .catch(() => toast.error("Failed to load properties"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      wishlistService.list().then((w) => setWishlistIds(new Set(w.map((p) => p.id)))).catch(() => {});
    }
  }, [user]);

  const apply = (next) => {
    const sp = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v === "" || v === false || v === null || v === undefined) return;
      sp.set(k, String(v));
    });
    sp.set("page", "1");
    setSearchParams(sp);
  };

  const goPage = (p) => {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(p));
    setSearchParams(sp);
  };

  const toggleWish = async (p) => {
    if (!user) return toast.error("Please login to save favorites");
    try {
      if (wishlistIds.has(p.id)) {
        await wishlistService.remove(p.id);
        setWishlistIds((s) => {
          const n = new Set(s);
          n.delete(p.id);
          return n;
        });
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.add(p.id);
        setWishlistIds((s) => new Set(s).add(p.id));
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">Browse Properties</h1>
        <p className="text-slate-500 mt-1">{data.total} properties found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Filters value={filters} onChange={apply} />

        <div className="flex-1 min-w-0">
          {loading ? (
            <Loader />
          ) : data.items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500">No properties match your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {data.items.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    onWishlist={toggleWish}
                    wishlisted={wishlistIds.has(p.id)}
                  />
                ))}
              </div>

              {data.pages > 1 && (
                <div className="mt-8 flex justify-center gap-1 flex-wrap">
                  <button onClick={() => goPage(Math.max(1, page - 1))} disabled={page === 1}
                    className="px-3 py-2 rounded-lg bg-white border border-slate-200 disabled:opacity-40">
                    Prev
                  </button>
                  {Array.from({ length: data.pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goPage(i + 1)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg border ${
                        page === i + 1 ? "bg-primary-600 text-white border-primary-600" : "bg-white border-slate-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => goPage(Math.min(data.pages, page + 1))} disabled={page === data.pages}
                    className="px-3 py-2 rounded-lg bg-white border border-slate-200 disabled:opacity-40">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
