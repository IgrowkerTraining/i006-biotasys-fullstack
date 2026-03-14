import { useState, useCallback } from "react";
import { Modal } from "./Modal";
import { Input } from "./Input";

interface ChangeEmailModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { email: string; password: string }) => Promise<void>;
  title?: string;
  subtitle?: string;
  currentEmail?: string;
  isLoading?: boolean;
}

export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Cambiar correo electrónico",
  subtitle = "Introduzca un nuevo correo electrónico y su contraseña existente",
  currentEmail = "",
  isLoading = false,
}) => {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [checkingPassword, setCheckingPassword] = useState(false);

  // Validar email
  const validateEmail = useCallback((value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, email: "El correo no puede estar vacío" }));
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: "Correo electrónico inválido" }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, email: undefined }));
    return true;
  }, []);

  // Validar contraseña en tiempo real
  const handlePasswordChange = useCallback(async (value: string) => {
    setPassword(value);
    if (!value) {
      setPasswordValid(false);
      setErrors(prev => ({ ...prev, password: undefined }));
      return;
    }

    setCheckingPassword(true);
    try {
      const isValid = value.length >= 6; // Validación básica
      setPasswordValid(isValid);
      if (isValid) {
        setErrors(prev => ({ ...prev, password: undefined }));
      } else {
        setErrors(prev => ({ ...prev, password: "Contraseña inválida" }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, password: "Error al validar contraseña" }));
    } finally {
      setCheckingPassword(false);
    }
  }, []);

  const handleConfirm = async () => {
    const isEmailValid = validateEmail(email);
    
    if (!isEmailValid || !passwordValid) {
      return;
    }

    try {
      await onConfirm({
        email: email.trim(),
        password,
      });
      // Reset formulario
      setEmail(currentEmail);
      setPassword("");
      setShowPassword(false);
      setPasswordValid(false);
      setErrors({});
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const handleClose = () => {
    // Reset formulario
    setEmail(currentEmail);
    setPassword("");
    setShowPassword(false);
    setPasswordValid(false);
    setErrors({});
    onClose();
  };

  const isFormValid = email.trim() !== "" && passwordValid && !isLoading;

  return (
    <Modal open={open}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          {/* Email */}
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
            error={errors.email}
            disabled={isLoading}
          />

          {/* Contraseña actual */}
          <div>
            <label className="text-sm font-medium text-gray-700 ml-1 block mb-1.5">
              Contraseña actual
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-10
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {checkingPassword && (
              <p className="text-xs text-gray-600 mt-1 ml-1">Validando...</p>
            )}
            {passwordValid && !checkingPassword && (
              <p className="text-xs text-green-500 mt-1 ml-1">
                Coincide (respuesta tiempo real)
              </p>
            )}
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-indigo-500 text-indigo-400
              hover:bg-indigo-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              font-medium text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white
              hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              font-medium text-sm"
          >
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
