// Auth context: persists JWT + user in localStorage and exposes login/logout/register.
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("rn_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("rn_token"));
  const [loading, setLoading] = useState(false);

  // Re-validate token on mount; if invalid, the api interceptor will clear storage.
  useEffect(() => {
    let active = true;
    if (token && !user) {
      authService
        .me()
        .then((u) => active && setUser(u))
        .catch(() => active && logout());
    }
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (data) => {
    localStorage.setItem("rn_token", data.access_token);
    localStorage.setItem("rn_user", JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const login = async (creds) => {
    setLoading(true);
    try {
      const data = await authService.login(creds);
      persist(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      persist(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("rn_token");
    localStorage.removeItem("rn_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (u) => {
    setUser(u);
    localStorage.setItem("rn_user", JSON.stringify(u));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
