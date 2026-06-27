import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { userService } from "../services/userService";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", bio: "", avatar: "" });
  const [pwd, setPwd] = useState({ old_password: "", new_password: "" });

  useEffect(() => {
    if (user) setForm({
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    try {
      const updated = await userService.update(form);
      updateUser(updated);
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    }
  };

  const changePwd = async (e) => {
    e.preventDefault();
    try {
      await userService.changePassword(pwd);
      toast.success("Password changed");
      setPwd({ old_password: "", new_password: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not change password");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold">Profile Settings</h1>

      <form onSubmit={save} className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 grid place-items-center text-2xl font-bold overflow-hidden">
            {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" /> : (user?.name?.[0]?.toUpperCase() || "U")}
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-600">Avatar URL</label>
            <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 resize-none" />
        </div>
        <button className="px-5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold">
          Save Changes
        </button>
      </form>

      <form onSubmit={changePwd} className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-4">
        <h2 className="font-bold text-lg">Change Password</h2>
        <div>
          <label className="text-xs font-semibold text-slate-600">Current Password</label>
          <input required type="password" value={pwd.old_password}
            onChange={(e) => setPwd({ ...pwd, old_password: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">New Password</label>
          <input required type="password" minLength={6} value={pwd.new_password}
            onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500" />
        </div>
        <button className="px-5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold">
          Update Password
        </button>
      </form>
    </div>
  );
}
