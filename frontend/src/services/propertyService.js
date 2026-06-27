import api from "./api";

export const propertyService = {
  list: (params = {}) => api.get("/api/properties/", { params }).then((r) => r.data),
  featured: () => api.get("/api/properties/featured").then((r) => r.data),
  get: (id) => api.get(`/api/properties/${id}`).then((r) => r.data),
  create: (data) => api.post("/api/properties/", data).then((r) => r.data),
  update: (id, data) => api.put(`/api/properties/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/api/properties/${id}`).then((r) => r.data),
  mine: () => api.get("/api/properties/owner/mine").then((r) => r.data),
};
