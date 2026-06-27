import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiHome } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/helpers";

const links = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 grid place-items-center text-white shadow-glow">
            <FiHome />
          </span>
          <span className="font-extrabold text-lg tracking-tight">
            Room<span className="text-primary-600">Nest</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? "text-primary-600" : "text-slate-700 hover:text-primary-600"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100"
              >
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 grid place-items-center text-sm font-bold">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="text-sm font-medium">{user.name}</span>
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden"
                  >
                    <Link to={dashboardPathFor(user.role)} onClick={() => setMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 text-sm">
                      <FiUser /> Dashboard
                    </Link>
                    <Link to="/wishlist" onClick={() => setMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 text-sm">
                      <FiHeart /> Wishlist
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-50 text-sm text-rose-600">
                      <FiLogOut /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-primary-600">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 shadow-glow transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-2xl" onClick={() => setOpen((o) => !o)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 text-sm font-medium"
                >
                  {l.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <Link onClick={() => setOpen(false)} to={dashboardPathFor(user.role)} className="px-3 py-2 rounded-lg hover:bg-slate-100 text-sm">
                    Dashboard
                  </Link>
                  <Link onClick={() => setOpen(false)} to="/wishlist" className="px-3 py-2 rounded-lg hover:bg-slate-100 text-sm">
                    Wishlist
                  </Link>
                  <button onClick={() => { setOpen(false); handleLogout(); }} className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-rose-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link onClick={() => setOpen(false)} to="/login" className="px-3 py-2 rounded-lg hover:bg-slate-100 text-sm">
                    Login
                  </Link>
                  <Link onClick={() => setOpen(false)} to="/register" className="px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
