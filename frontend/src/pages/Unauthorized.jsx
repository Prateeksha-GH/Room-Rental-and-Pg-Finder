import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-[70vh] grid place-items-center text-center px-4">
      <div>
        <p className="text-7xl font-extrabold text-rose-600">403</p>
        <h1 className="mt-2 text-2xl font-bold">Unauthorized</h1>
        <p className="text-slate-500 mt-1">You don't have permission to access this page.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700">
          Go Home
        </Link>
      </div>
    </div>
  );
}
