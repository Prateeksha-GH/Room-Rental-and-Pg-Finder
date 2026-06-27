import { Link } from "react-router-dom";
import { FiHome, FiTwitter, FiInstagram, FiFacebook, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 grid place-items-center text-white">
              <FiHome />
            </span>
            <span className="font-extrabold text-lg text-white">RoomNest</span>
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Find PGs, hostels, and rental rooms across India with verified listings, ratings, and easy booking.
          </p>
          <div className="flex gap-3 mt-5 text-lg">
            <a href="#" className="hover:text-white"><FiTwitter /></a>
            <a href="#" className="hover:text-white"><FiInstagram /></a>
            <a href="#" className="hover:text-white"><FiFacebook /></a>
            <a href="#" className="hover:text-white"><FiLinkedin /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/properties" className="hover:text-white">All Properties</Link></li>
            <li><Link to="/properties?category=pg" className="hover:text-white">PG Accommodations</Link></li>
            <li><Link to="/properties?category=hostel" className="hover:text-white">Hostels</Link></li>
            <li><Link to="/properties?category=flat" className="hover:text-white">Rental Flats</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-slate-400 mb-3">Get the freshest listings in your inbox.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="flex-1 rounded-lg px-3 py-2 bg-slate-800 text-sm outline-none ring-1 ring-slate-700 focus:ring-primary-500"
              placeholder="you@email.com" />
            <button className="px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 text-sm text-slate-500 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} RoomNest. All rights reserved.</span>
          <span>Built with FastAPI · React · MongoDB</span>
        </div>
      </div>
    </footer>
  );
}
