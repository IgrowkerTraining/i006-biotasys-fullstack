import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { FaUserMd, FaFlask } from "react-icons/fa";
import loginHero from "../../assets/login-hero.png";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"nutricionista" | "laboratorio" | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    if (!selectedRole) {
      setError("Por favor selecciona tu perfil antes de iniciar sesión");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.login({
        email,
        password,
        role: selectedRole,
      });

      login(response.user, response.accessToken, response.refreshToken);

      if (selectedRole === "nutricionista") {
        navigate("/dashboardNutritionist");
      } else {
        navigate("/dashboardLaboratory");
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] bg-white">
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 p-8 rounded-[28px] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-5">Acceder a tu cuenta</h1>
              <p className="text-slate-600 text-center">
                Empieza a gestionar y unificar datos de microbiota intestinal
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                onClick={() => setSelectedRole("nutricionista")}
                className={`cursor-pointer border rounded-2xl p-4 text-center transition flex flex-col items-center ${
                  selectedRole === "nutricionista"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300"
                }`}
              >
                <FaUserMd className="text-3xl text-indigo-600 mb-2" />
                <h3 className="font-semibold text-black">Nutricionista</h3>
                <p className="text-sm text-gray-500">Alta de pacientes y generación de informes</p>
              </div>

              <div
                onClick={() => setSelectedRole("laboratorio")}
                className={`cursor-pointer border rounded-2xl p-4 text-center transition flex flex-col items-center ${
                  selectedRole === "laboratorio"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300"
                }`}
              >
                <FaFlask className="text-3xl text-indigo-600 mb-2" />
                <h3 className="font-semibold text-black">Laboratorista</h3>
                <p className="text-sm text-gray-500">Carga de resultados para el nutricionista</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                placeholder="Email corporativo"
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-gray-900 placeholder-gray-400 border border-gray-300"
              />

              <Input
                placeholder="Contraseña / Credenciales"
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-gray-900 placeholder-gray-400 border border-gray-300"
              />

              <div className="flex items-center justify-between">
                <Link
                  to="/passwordRecovery"
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  ¿Has olvidado tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                Iniciar sesión
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-500 text-sm">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-indigo-500 hover:text-indigo-400 font-semibold transition-colors"
                >
                  Crear cuenta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-[#2d6bff] via-[#3e9df1] to-[#73d7ff]"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(45,107,255,0.88) 0%, rgba(45,107,255,0.54) 38%, rgba(255,255,255,0.12) 100%), url(${loginHero})`,
          backgroundPosition: "left top, right bottom",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "auto, 84%",
        }}
      >

        <div className="relative z-10 flex h-full w-full flex-col justify-start p-10 lg:p-12">
          <div className="max-w-md text-white">
            <h1 className="text-5xl font-bold tracking-tight">Biotasys</h1>
            <h2 className="mt-3 text-xl font-medium">Soporte a la decisión clínica</h2>
            <p className="mt-6 text-lg leading-8 text-white/92">
              El soporte digital especializado en el análisis IA de microbiota y
              generación de informes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
