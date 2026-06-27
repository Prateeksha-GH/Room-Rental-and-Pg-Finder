import { useState, useEffect, useRef } from "react";
import { FiFilter, FiX } from "react-icons/fi";

const initial = {
  q: "", city: "", min_price: "", max_price: "",
  gender: "", room_type: "", category: "",
  food_included: false, ac: false, wifi: false, furnished: false,
};

const DEBOUNCE_MS = 400;
const DEBOUNCED_KEYS = new Set(["q", "city", "min_price", "max_price"]);

export default function Filters({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ ...initial, ...value });
  const timerRef = useRef(null);

  // Sync from URL-driven `value` only when its content changes — guards against parent
  // re-renders (loading/data updates) wiping mid-typing draft state.
  const valueKey = JSON.stringify({ ...initial, ...value });
  useEffect(() => {
    setDraft({ ...initial, ...value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueKey]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const update = (k, v) => {
    const next = { ...draft, [k]: v };
    setDraft(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (DEBOUNCED_KEYS.has(k)) {
      timerRef.current = setTimeout(() => onChange(next), DEBOUNCE_MS);
    } else {
      onChange(next);
    }
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDraft(initial);
    onChange(initial);
  };

  const Panel = (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600">Search</label>
        <input value={draft.q || ""} onChange={(e) => update("q", e.target.value)}
          placeholder="PG name, location..."
          className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">City</label>
        <input value={draft.city || ""} onChange={(e) => update("city", e.target.value)}
          placeholder="Bangalore"
          className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600">Min Price</label>
          <input type="number" value={draft.min_price || ""} onChange={(e) => update("min_price", e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Max Price</label>
          <input type="number" value={draft.max_price || ""} onChange={(e) => update("max_price", e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Gender</label>
        <select value={draft.gender || ""} onChange={(e) => update("gender", e.target.value)}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500">
          <option value="">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="any">Co-ed</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Room Type</label>
        <select value={draft.room_type || ""} onChange={(e) => update("room_type", e.target.value)}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500">
          <option value="">Any</option>
          <option value="single">Single</option>
          <option value="shared">Shared</option>
          <option value="private">Private</option>
          <option value="dormitory">Dormitory</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Category</label>
        <select value={draft.category || ""} onChange={(e) => update("category", e.target.value)}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500">
          <option value="">All</option>
          <option value="pg">PG</option>
          <option value="hostel">Hostel</option>
          <option value="rental">Rental</option>
          <option value="flat">Flat</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {[
          ["food_included", "Food"],
          ["ac", "AC"],
          ["wifi", "WiFi"],
          ["furnished", "Furnished"],
        ].map(([k, label]) => (
          <label key={k} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
            draft[k] ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-200"
          }`}>
            <input type="checkbox" checked={!!draft[k]} onChange={(e) => update(k, e.target.checked)}
              className="accent-primary-600" />
            {label}
          </label>
        ))}
      </div>
      <div className="pt-2">
        <button onClick={reset} className="w-full py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:w-72 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-soft p-5 sticky top-20 h-fit">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><FiFilter /> Filters</h3>
        {Panel}
      </aside>

      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-soft mb-4"
      >
        <FiFilter /> Filters
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><FiFilter /> Filters</h3>
              <button onClick={() => setOpen(false)}><FiX /></button>
            </div>
            {Panel}
          </div>
        </div>
      )}
    </>
  );
}
