import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiGrid, FiPlusSquare, FiList, FiHeart, FiUser, FiUsers, FiBookOpen, FiSettings, FiBell,
} from "react-icons/fi";

const tenantLinks = [
  { to: "/dashboard/tenant", label: "Overview", icon: FiGrid, end: true },
  { to: "/dashboard/tenant/bookings", label: "Bookings", icon: FiBookOpen },
  { to: "/wishlist", label: "Wishlist", icon: FiHeart },
  { to: "/profile", label: "Profile", icon: FiUser },
];

const ownerLinks = [
  { to: "/dashboard/owner", label: "Overview", icon: FiGrid, end: true },
  { to: "/dashboard/owner/add", label: "Add Property", icon: FiPlusSquare },
  { to: "/dashboard/owner/properties", label: "My Properties", icon: FiList },
  { to: "/dashboard/owner/bookings", label: "Bookings", icon: FiBookOpen },
  { to: "/profile", label: "Profile", icon: FiUser },
];

const adminLinks = [
  { to: "/dashboard/admin", label: "Overview", icon: FiGrid, end: true },
  { to: "/dashboard/admin/users", label: "Users", icon: FiUsers },
  { to: "/dashboard/admin/properties", label: "All Listings", icon: FiList },
  { to: "/profile", label: "Profile", icon: FiUser },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links =
    user?.role === "admin" ? adminLinks :
    user?.role === "owner" ? ownerLinks :
    tenantLinks;

  return (
    <aside className="lg:w-64 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-soft p-3 h-fit lg:sticky lg:top-20">
      <div className="px-3 py-3 border-b border-slate-100 mb-2">
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
        <p className="text-xs text-primary-600 font-medium capitalize">{user?.role}</p>
      </div>
      <nav className="flex lg:flex-col gap-1 overflow-x-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition shrink-0 ${
                isActive ? "bg-primary-50 text-primary-700" : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            <l.icon /> {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
