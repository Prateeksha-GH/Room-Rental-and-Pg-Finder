import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiPhone, FiCalendar, FiCheck } from "react-icons/fi";
import { propertyService } from "../services/propertyService";
import { bookingService } from "../services/bookingService";
import { reviewService, wishlistService } from "../services/userService";
import Loader from "../components/Loader";
import ChatBox from "../components/ChatBox";
import { useAuth } from "../hooks/useAuth";
import { formatPrice } from "../utils/helpers";

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prop, setProp] = useState(null);
  const [active, setActive] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    propertyService.get(id).then(setProp).catch(() => toast.error("Property not found"));
    reviewService.forProperty(id).then(setReviews).catch(() => {});
  }, [id]);

  if (!prop) return <Loader label="Fetching property..." />;

  const requireAuth = () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return false;
    }
    return true;
  };

  const book = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!visitDate) return toast.error("Pick a visit date");
    try {
      await bookingService.create({ property_id: id, visit_date: visitDate, message });
      toast.success("Visit request sent!");
      setVisitDate("");
      setMessage("");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Booking failed");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    try {
      await reviewService.create({ property_id: id, ...newReview });
      toast.success("Review posted");
      setNewReview({ rating: 5, comment: "" });
      const refreshed = await reviewService.forProperty(id);
      setReviews(refreshed);
      const p = await propertyService.get(id);
      setProp(p);
    } catch {
      toast.error("Could not post review");
    }
  };

  const saveToWishlist = async () => {
    if (!requireAuth()) return;
    try {
      await wishlistService.add(id);
      toast.success("Saved to wishlist");
    } catch {
      toast.error("Could not save");
    }
  };

  const images = prop.images?.length ? prop.images : ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-primary-600 mb-4">
        ← Back
      </button>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        <div>
          <motion.img
            key={images[active]}
            src={images[active]}
            alt={prop.title}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="w-full h-[420px] object-cover rounded-3xl shadow-soft"
          />
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActive(i)}
                  className={`w-24 h-20 object-cover rounded-xl cursor-pointer flex-shrink-0 ring-2 transition ${
                    active === i ? "ring-primary-500" : "ring-transparent"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="mt-8">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold capitalize">
              {prop.category}
            </span>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">{prop.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-slate-500">
              <FiMapPin /> {prop.location}, {prop.city}
            </p>
            <p className="mt-2 flex items-center gap-2 text-amber-500">
              <FiStar className="fill-current" /> {prop.rating?.toFixed(1) || "0.0"}
              <span className="text-slate-500 text-sm">({prop.review_count || 0} reviews)</span>
            </p>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">About this property</h2>
            <p className="text-slate-700 leading-relaxed">{prop.description}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                ["WiFi", prop.wifi],
                ["AC", prop.ac],
                ["Food Included", prop.food_included],
                ["Furnished", prop.furnished],
                ["Parking", prop.parking],
                ["Laundry", prop.laundry],
              ]
                .filter(([, v]) => v)
                .map(([k]) => (
                  <div key={k} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <FiCheck /> {k}
                  </div>
                ))}
              {(prop.amenities || []).map((a) => (
                <div key={a} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-slate-700">
                  <FiCheck /> {a}
                </div>
              ))}
            </div>
          </section>

          {prop.map_url && (
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-3">Location</h2>
              <iframe
                title="map"
                src={prop.map_url}
                className="w-full h-72 rounded-2xl border border-slate-100"
                loading="lazy"
              />
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">Reviews & Ratings</h2>
            <form onSubmit={submitReview} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-4 mb-4">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setNewReview({ ...newReview, rating: n })}>
                    <FiStar className={`text-2xl ${n <= newReview.rating ? "text-amber-500 fill-current" : "text-slate-300"}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder={user ? "Share your experience..." : "Login to write a review"}
                disabled={!user}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 resize-none"
                rows={3}
              />
              <button disabled={!user} className="mt-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold disabled:opacity-50">
                Post Review
              </button>
            </form>
            <div className="space-y-3">
              {reviews.length === 0 && <p className="text-slate-500 text-sm">No reviews yet — be the first!</p>}
              {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-white rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 grid place-items-center font-bold">
                        {r.user_name?.[0]?.toUpperCase()}
                      </span>
                      <p className="font-semibold">{r.user_name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-sm">
                      <FiStar className="fill-current" /> {r.rating?.toFixed(1)}
                    </div>
                  </div>
                  {r.comment && <p className="mt-2 text-slate-700">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 lg:sticky lg:top-20">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-primary-700">{formatPrice(prop.price)}</span>
              <span className="text-slate-500 mb-1">/ month</span>
            </div>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-slate-100 capitalize">{prop.room_type}</span>
              <span className="px-2 py-1 rounded-full bg-slate-100 capitalize">For {prop.gender}</span>
            </div>

            <form onSubmit={book} className="mt-5 space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">Visit Date</span>
                <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-primary-500">
                  <FiCalendar className="text-slate-400" />
                  <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)}
                    className="flex-1 outline-none bg-transparent" required />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">Message (optional)</span>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  rows={3} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-primary-500 resize-none"
                  placeholder="Hi, I'd like to schedule a visit..." />
              </label>
              <button className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold">
                Book a Visit
              </button>
              <button type="button" onClick={saveToWishlist}
                className="w-full py-2.5 rounded-xl border-2 border-slate-200 hover:border-primary-500 hover:text-primary-700 font-semibold">
                Save to Wishlist
              </button>
            </form>

            <div className="mt-5 pt-4 border-t">
              <p className="text-xs text-slate-500 mb-2">Contact owner</p>
              <a href="tel:+919999999999" className="flex items-center gap-2 text-primary-700 font-semibold">
                <FiPhone /> Call owner
              </a>
            </div>
          </div>

          <ChatBox peerName="Owner" />
        </aside>
      </div>
    </div>
  );
}
