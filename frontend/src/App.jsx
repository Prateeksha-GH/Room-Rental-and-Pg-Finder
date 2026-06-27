// Top-level routing tree. Public + protected (role-gated) routes are split here.
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

import TenantDashboard from "./pages/dashboard/TenantDashboard";
import TenantBookings from "./pages/dashboard/TenantBookings";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import OwnerBookings from "./pages/dashboard/OwnerBookings";
import AddProperty from "./pages/dashboard/AddProperty";
import ManageProperties from "./pages/dashboard/ManageProperties";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminUsers from "./pages/dashboard/AdminUsers";
import AdminProperties from "./pages/dashboard/AdminProperties";

export default function App() {
  return (
    <Routes>
      {/* Public site under MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Tenant dashboard (auth required) */}
      <Route
        element={
          <ProtectedRoute roles={["tenant", "owner", "admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/tenant" element={<TenantDashboard />} />
        <Route path="/dashboard/tenant/bookings" element={<TenantBookings />} />
      </Route>

      {/* Owner dashboard */}
      <Route
        element={
          <ProtectedRoute roles={["owner", "admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/owner" element={<OwnerDashboard />} />
        <Route path="/dashboard/owner/add" element={<AddProperty />} />
        <Route path="/dashboard/owner/edit/:id" element={<AddProperty />} />
        <Route path="/dashboard/owner/properties" element={<ManageProperties />} />
        <Route path="/dashboard/owner/bookings" element={<OwnerBookings />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/users" element={<AdminUsers />} />
        <Route path="/dashboard/admin/properties" element={<AdminProperties />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
