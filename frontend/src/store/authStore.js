import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../api/endpoints";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (userData, token) => {
        localStorage.setItem("token", token);
        set({ user: userData, token, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token") || get().token;

        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        try {
          const profile = await authAPI.getProfile();
          set({
            user: {
              id: profile._id,
              nombre: profile.nombre,
              email: profile.email,
              rol: profile.rol
            },
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch {
          localStorage.removeItem("token");
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      isAdmin: () => get().user?.rol === "admin"
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true;
        }
      }
    }
  )
);
