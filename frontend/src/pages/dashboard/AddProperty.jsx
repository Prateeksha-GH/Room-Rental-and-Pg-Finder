// Used for both create and edit (when ":id" param is present).
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { propertyService } from "../../services/propertyService";

const defaults = {
  title: "", description: "", location: "", city: "", price: 5000,
  gender: "any", room_type: "single", category: "pg",
  food_included: false, ac: false, wifi: true, furnished: false, parking: false, laundry: false,
  images: "", amenities: "", map_url: "", available: true,
};

export default function AddProperty() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(defaults);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      propertyService.get(id).then((p) => setForm({
        ...defaults, ...p,
        images: (p.images || []).join("\n"),
        amenities: (p.amenities || []).join(", "),
      }));
    }
  }, [id, isEdit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (isEdit) {
        await propertyService.update(id, payload);
        toast.success("Property updated");
      } else {
        await propertyService.create(payload);
        toast.success("Property listed!");
      }
      navigate("/dashboard/owner/properties");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to save");
    }
  };

  const F = ({ label, children }) => (
    <label className="block">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">{isEdit ? "Edit Property" : "Add a Property"}</h1>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-4">
        <F label="Title">
          <input required value={form.title} onChange={(e) => set("title", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
        </F>
        <F label="Description">
          <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 resize-none" />
        </F>
        <div className="grid grid-cols-2 gap-3">
          <F label="Location"><input required value={form.location} onChange={(e) => set("location", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" /></F>
          <F label="City"><input required value={form.city} onChange={(e) => set("city", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" /></F>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <F label="Price / mo"><input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" /></F>
          <F label="Gender">
            <select value={form.gender} onChange={(e) => set("gender", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500">
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </F>
          <F label="Room Type">
            <select value={form.room_type} onChange={(e) => set("room_type", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500">
              <option value="single">Single</option>
              <option value="shared">Shared</option>
              <option value="private">Private</option>
              <option value="dormitory">Dormitory</option>
            </select>
          </F>
          <F label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500">
              <option value="pg">PG</option>
              <option value="hostel">Hostel</option>
              <option value="rental">Rental</option>
              <option value="flat">Flat</option>
            </select>
          </F>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {["food_included", "ac", "wifi", "furnished", "parking", "laundry"].map((k) => (
            <label key={k} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
              form[k] ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-200"
            }`}>
              <input type="checkbox" checked={!!form[k]} onChange={(e) => set(k, e.target.checked)} className="accent-primary-600" />
              {k.replace("_", " ")}
            </label>
          ))}
        </div>
        <F label="Image URLs (one per line)">
          <textarea rows={3} value={form.images} onChange={(e) => set("images", e.target.value)}
            placeholder="https://...&#10;https://..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 resize-none" />
        </F>
        <F label="Amenities (comma-separated)">
          <input value={form.amenities} onChange={(e) => set("amenities", e.target.value)}
            placeholder="WiFi, Hot Water, CCTV"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
        </F>
        <F label="Google Maps embed URL">
          <input value={form.map_url} onChange={(e) => set("map_url", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
        </F>
        <button className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold">
          {isEdit ? "Save Changes" : "Publish Property"}
        </button>
      </form>
    </div>
  );
}
