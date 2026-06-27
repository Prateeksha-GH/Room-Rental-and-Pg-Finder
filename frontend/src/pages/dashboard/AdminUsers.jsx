import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import { adminService } from "../../services/userService";
import { formatDate } from "../../utils/helpers";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = () => adminService.users().then(setUsers).catch(() => {});
  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await adminService.removeUser(id);
      toast.success("User removed");
      load();
    } catch {
      toast.error("Could not delete");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold">Manage Users</h1>
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-semibold">{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(u.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-semibold">
                      <FiTrash2 /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
