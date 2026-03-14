import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  laboratory: string | null;
  role: string | null;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (fullName: string, currentPassword: string) => Promise<UserProfile>;
  updateLaboratory: (laboratory: string, currentPassword: string) => Promise<UserProfile>;
  updateEmail: (email: string, currentPassword: string) => Promise<UserProfile>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  changeRole: (newRole: string) => Promise<void>;
}

// Datos de ejemplo como fallback
const DEFAULT_USER_PROFILE: UserProfile = {
  id: "01a1c992-4b9f-4e31-b262-f7963fdd85be",
  email: "user@biotasys.com",
  fullName: "Usuario de Prueba",
  laboratory: "BiomeLab",
  role: "LABORATORIO",
  isActive: true,
  emailVerified: true,
  lastLoginAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useUserProfile = (): UseUserProfileReturn => {
  const authContext = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el usuario del contexto o del localStorage
  const getUserId = () => {
    if (authContext?.user?.id) {
      return authContext.user.id;
    }
    
    // Fallback: intentar obtener del localStorage
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.id;
      }
    } catch (err) {
      console.error("Error parsing stored user:", err);
    }
    
    return null;
  };

  const fetchUserProfile = async () => {
    const userId = getUserId();
    
    if (!userId) {
      setLoading(false);
      setError("No hay usuario autenticado");
      // Usar datos de ejemplo como fallback
      setUserProfile(DEFAULT_USER_PROFILE);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("example_token");
      if (!token) {
        console.warn("No hay token de autenticación, usando datos de ejemplo");
        setUserProfile(DEFAULT_USER_PROFILE);
        setLoading(false);
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.warn(
          `Error al obtener perfil (${response.status}), usando datos de ejemplo`
        );
        // Usar datos de ejemplo como fallback
        setUserProfile(DEFAULT_USER_PROFILE);
        setLoading(false);
        return;
      }

      const data: UserProfile = await response.json();
      setUserProfile(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al cargar el perfil";
      console.error("Error fetching user profile:", err);
      
      // Usar datos de ejemplo como fallback
      setUserProfile(DEFAULT_USER_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [authContext?.user?.id]);

  const updateProfile = async (
    fullName: string,
    currentPassword: string
  ): Promise<UserProfile> => {
    const userId = getUserId();
    
    if (!userId) {
      throw new Error("No hay usuario autenticado");
    }

    try {
      const token = localStorage.getItem("example_token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName,
            currentPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al actualizar el perfil"
        );
      }

      const updatedProfile: UserProfile = await response.json();
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al actualizar el perfil";
      console.error("Error updating user profile:", err);
      throw new Error(errorMessage);
    }
  };

  const updateLaboratory = async (
    laboratory: string,
    currentPassword: string
  ): Promise<UserProfile> => {
    const userId = getUserId();
    
    if (!userId) {
      throw new Error("No hay usuario autenticado");
    }

    try {
      const token = localStorage.getItem("example_token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            laboratory,
            currentPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al actualizar el centro adscrito"
        );
      }

      const updatedProfile: UserProfile = await response.json();
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al actualizar el centro adscrito";
      console.error("Error updating laboratory:", err);
      throw new Error(errorMessage);
    }
  };

  const updateEmail = async (
    email: string,
    currentPassword: string
  ): Promise<UserProfile> => {
    const userId = getUserId();
    
    if (!userId) {
      throw new Error("No hay usuario autenticado");
    }

    try {
      const token = localStorage.getItem("example_token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            currentPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al actualizar el correo electrónico"
        );
      }

      const updatedProfile: UserProfile = await response.json();
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al actualizar el correo electrónico";
      console.error("Error updating email:", err);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const userId = getUserId();
    
    if (!userId) {
      throw new Error("No hay usuario autenticado");
    }

    try {
      const token = localStorage.getItem("example_token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al cambiar la contraseña"
        );
      }

      // No retornamos nada, solo confirmamos que fue exitoso
      await fetchUserProfile();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al cambiar la contraseña";
      console.error("Error changing password:", err);
      throw new Error(errorMessage);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    const userId = getUserId();
    
    if (!userId) {
      throw new Error("No hay usuario autenticado");
    }

    try {
      const token = localStorage.getItem("example_token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al eliminar la cuenta"
        );
      }

      // Limpiar datos locales
      localStorage.removeItem("user");
      localStorage.removeItem("example_token");
      setUserProfile(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al eliminar la cuenta";
      console.error("Error deleting account:", err);
      throw new Error(errorMessage);
    }
  };

  const changeRole = async (newRole: string): Promise<void> => {
    try {
      const token = localStorage.getItem("example_token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/auth/switch-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al cambiar el rol"
        );
      }

      const data = await response.json();
      
      // Actualizar token de autenticación
      if (data.accessToken) {
        localStorage.setItem("example_token", data.accessToken);
      }

      // Refrescar datos del perfil
      await fetchUserProfile();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al cambiar el rol";
      console.error("Error changing role:", err);
      throw new Error(errorMessage);
    }
  };

  return {
    userProfile,
    loading,
    error,
    refetch: fetchUserProfile,
    updateProfile,
    updateLaboratory,
    updateEmail,
    changePassword,
    deleteAccount,
    changeRole,
  };
};
