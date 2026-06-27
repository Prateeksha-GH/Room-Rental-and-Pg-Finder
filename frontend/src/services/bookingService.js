import api from "./api";

export const bookingService = {
  create: (data) => api.post("/api/bookings/", data).then((r) => r.data),
  my: () => api.get("/api/bookings/my").then((r) => r.data),
  owner: () => api.get("/api/bookings/owner").then((r) => r.data),
  update: (id, data) => api.put(`/api/bookings/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/api/bookings/${id}`).then((r) => r.data),
};
