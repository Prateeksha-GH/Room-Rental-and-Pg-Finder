import api from "./api";

export const userService = {
  profile: () => api.get("/api/users/profile").then((r) => r.data),
  update: (data) => api.put("/api/users/profile", data).then((r) => r.data),
  changePassword: (data) => api.put("/api/users/password", data).then((r) => r.data),
};

export const wishlistService = {
  list: () => api.get("/api/wishlists/").then((r) => r.data),
  add: (id) => api.post(`/api/wishlists/${id}`).then((r) => r.data),
  remove: (id) => api.delete(`/api/wishlists/${id}`).then((r) => r.data),
};

export const reviewService = {
  create: (data) => api.post("/api/reviews/", data).then((r) => r.data),
  forProperty: (id) => api.get(`/api/reviews/property/${id}`).then((r) => r.data),
};

export const notificationService = {
  list: () => api.get("/api/notifications/").then((r) => r.data),
  markRead: (id) => api.put(`/api/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.put("/api/notifications/read-all").then((r) => r.data),
};

export const adminService = {
  stats: () => api.get("/api/admin/stats").then((r) => r.data),
  users: () => api.get("/api/admin/users").then((r) => r.data),
  removeUser: (id) => api.delete(`/api/admin/users/${id}`).then((r) => r.data),
  properties: () => api.get("/api/admin/properties").then((r) => r.data),
  removeProperty: (id) => api.delete(`/api/admin/properties/${id}`).then((r) => r.data),
};
