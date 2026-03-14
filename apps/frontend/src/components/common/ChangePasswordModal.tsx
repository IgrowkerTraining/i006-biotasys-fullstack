import { useState, useCallback } from "react";
import { Modal } from "./Modal";
import { Input } from "./Input";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Cambiar contraseña",
  subtitle = "Introduzca su contraseña actual y elija una nueva contraseña",
  isLoading = false,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);

  // Validar contraseña actual
  const validateCurrentPassword = useCallback((value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, currentPassword: "La contraseña actual es requerida" }));
      return false;
    }
    setErrors(prev => ({ ...prev, currentPassword: undefined }));
    return true;
  }, []);

  // Validar contraseña nueva
  const validateNewPassword = useCallback((value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, newPassword: "La nueva contraseña es requerida" }));
      setPasswordStrength(null);
      return false;
    }
    
    if (value.length < 8) {
      setErrors(prev => ({ ...prev, newPassword: "La contraseña debe tener al menos 8 caracteres" }));
      setPasswordStrength("weak");
      return false;
    }

    // Calcular fortaleza
    let strength: "weak" | "medium" | "strong" = "weak";
    let criteriaCount = 0;

    if (/[a-z]/.test(value)) criteriaCount++;
    if (/[A-Z]/.test(value)) criteriaCount++;
    if (/[0-9]/.test(value)) criteriaCount++;
    if (/[^a-zA-Z0-9]/.test(value)) criteriaCount++;

    if (criteriaCount >= 4) strength = "strong";
    else if (criteriaCount >= 3) strength = "medium";
    else strength = "weak";

    setPasswordStrength(strength);
    setErrors(prev => ({ ...prev, newPassword: undefined }));
    return true;
  }, []);

  // Validar confirmación de contraseña
  const validateConfirmPassword = useCallback((value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, confirmPassword: "Debe confirmar la nueva contraseña" }));
      return false;
    }
    
    if (value !== newPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
      return false;
    }

    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    return true;
  }, [newPassword]);

  const handleConfirm = async () => {
    const isCurrentPasswordValid = validateCurrentPassword(currentPassword);
    const isNewPasswordValid = validateNewPassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (!isCurrentPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      await onConfirm({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      // Reset formulario
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setPasswordStrength(null);
      setErrors({});
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
    }
  };

  const handleClose = () => {
    // Reset formulario
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordStrength(null);
    setErrors({});
    onClose();
  };

  const isFormValid = 
    currentPassword.trim() !== "" && 
    newPassword !== "" && 
    confirmPassword !== "" && 
    !errors.currentPassword &&
    !errors.newPassword &&
    !errors.confirmPassword &&
    !isLoading;

  const getStrengthColor = (strength: "weak" | "medium" | "strong" | null) => {
    switch (strength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const getStrengthLabel = (strength: "weak" | "medium" | "strong" | null) => {
    switch (strength) {
      case "weak":
        return "Débil";
      case "medium":
        return "Media";
      case "strong":
        return "Fuerte";
      default:
        return "";
    }
  };

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
          {/* Contraseña actual */}
          <div>
            <label className="text-sm font-medium text-gray-700 ml-1 block mb-1.5">
              Contraseña actual
            </label>
            <div className="relative group">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onBlur={() => validateCurrentPassword(currentPassword)}
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-10
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                {showCurrentPassword ? (
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
            {errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1 ml-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="text-sm font-medium text-gray-700 ml-1 block mb-1.5">
              Nueva contraseña
            </label>
            <div className="relative group">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validateNewPassword(e.target.value);
                }}
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-10
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                {showNewPassword ? (
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
            
            {/* Indicador de fortaleza */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        passwordStrength === "weak"
                          ? i === 1
                            ? getStrengthColor("weak")
                            : "bg-gray-200"
                          : passwordStrength === "medium"
                          ? i <= 2
                            ? getStrengthColor("medium")
                            : "bg-gray-200"
                          : passwordStrength === "strong"
                          ? getStrengthColor("strong")
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ml-1 ${
                  passwordStrength === "weak"
                    ? "text-red-500"
                    : passwordStrength === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}>
                  Fortaleza: {getStrengthLabel(passwordStrength)}
                </p>
              </div>
            )}
            
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1 ml-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="text-sm font-medium text-gray-700 ml-1 block mb-1.5">
              Confirmar nueva contraseña
            </label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => validateConfirmPassword(confirmPassword)}
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-10
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
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
            {confirmPassword && confirmPassword === newPassword && (
              <p className="text-xs text-green-500 mt-1 ml-1">Las contraseñas coinciden</p>
            )}
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>
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
            {isLoading ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
