import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout, refreshToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.logout({ refreshToken });
    } catch (err) {
      console.error("Error al cerrar sesion:", err);
    } finally {
      logout();
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-xl font-bold text-black">Biotasys</h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </span>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-black font-semibold text-sm">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-gray-500 text-xs">{user?.role}</span>
            </div>
          </div>

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-xl border p-4 z-50">
              <div className="mb-3">
                <p className="text-sm font-semibold text-black">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-black hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <span>[P]</span> Mi perfil
              </button>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 mt-1"
              >
                <span>[X]</span> Cerrar sesion
              </button>
            </div>
          )}
        </div>
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold text-black mb-2">Cerrar sesion</h2>
            <p className="text-gray-600 text-sm mb-6">
              Seguro que deseas cerrar sesion? Tendras que volver a introducir tus credenciales.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancelar
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Cerrar sesion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
