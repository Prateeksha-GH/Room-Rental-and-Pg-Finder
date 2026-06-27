import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiHeart, FiWifi } from "react-icons/fi";
import { MdAcUnit, MdRestaurant } from "react-icons/md";
import { formatPrice } from "../utils/helpers";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200";

export default function PropertyCard({ property, onWishlist, wishlisted }) {
  const img = property.images?.[0] || FALLBACK_IMG;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 flex flex-col h-full"
    >
      <div className="relative">
        <Link to={`/properties/${property.id}`}>
          <img src={img} alt={property.title} className="w-full h-48 object-cover" />
        </Link>
        {onWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onWishlist(property);
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center shadow-soft transition ${
              wishlisted ? "bg-rose-500 text-white" : "bg-white text-slate-600 hover:text-rose-500"
            }`}
          >
            <FiHeart />
          </button>
        )}
        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold capitalize">
          {property.category}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/properties/${property.id}`} className="font-semibold text-slate-900 hover:text-primary-600 line-clamp-1">
            {property.title}
          </Link>
          <span className="flex items-center gap-1 text-amber-500 text-sm shrink-0">
            <FiStar /> {property.rating?.toFixed(1) || "0.0"}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 line-clamp-1">
          <FiMapPin /> {property.location}, {property.city}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          {property.wifi && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100">
              <FiWifi /> WiFi
            </span>
          )}
          {property.ac && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100">
              <MdAcUnit /> AC
            </span>
          )}
          {property.food_included && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100">
              <MdRestaurant /> Food
            </span>
          )}
          <span className="px-2 py-1 rounded-full bg-slate-100 capitalize">{property.room_type}</span>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-700">{formatPrice(property.price)}</span>
            <span className="text-xs text-slate-500"> / month</span>
          </div>
          <Link
            to={`/properties/${property.id}`}
            className="text-sm font-semibold text-primary-600 hover:text-primary-800"
          >
            View →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
