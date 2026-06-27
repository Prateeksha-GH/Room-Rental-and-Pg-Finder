export default function Loader({ label = "Loading..." }) {
  return (
    <div className="grid place-items-center py-20">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="mt-3 text-sm text-slate-500">{label}</p>
    </div>
  );
}
