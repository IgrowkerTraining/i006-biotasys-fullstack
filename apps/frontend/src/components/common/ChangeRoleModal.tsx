import { useState } from "react";
import { Modal } from "./Modal";

interface ChangeRoleModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newRole: string) => Promise<void>;
  currentRole?: string;
  isLoading?: boolean;
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  open,
  onClose,
  onConfirm,
  currentRole = "laboratorio",
  isLoading = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(
    currentRole === "nutricionista" ? "laboratorio" : "nutricionista"
  );

  const handleConfirm = async () => {
    try {
      await onConfirm(selectedRole);
      handleClose();
    } catch (error) {
      console.error("Error al cambiar rol:", error);
    }
  };

  const handleClose = () => {
    setSelectedRole(currentRole === "nutricionista" ? "laboratorio" : "nutricionista");
    onClose();
  };

  const roleOptions = [
    {
      value: "nutricionista",
      label: "Nutricionista",
      description: "Acceso a gestión de pacientes y planes nutricionales",
    },
    {
      value: "laboratorio",
      label: "Laboratorio",
      description: "Acceso a gestión de análisis de laboratorio",
    },
  ];

  const isFormValid = selectedRole !== currentRole && !isLoading;

  return (
    <Modal open={open}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Cambiar rol de sesión</h2>
            <p className="text-sm text-gray-600 mt-1">
              Cambiar tu rol actual para acceder a diferentes funcionalidades
            </p>
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

        {/* Rol actual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Rol actual:</span>{" "}
            {currentRole === "nutricionista" ? "Nutricionista" : "Laboratorio"}
          </p>
        </div>

        {/* Seleccionar rol */}
        <div className="space-y-3">
          {roleOptions.map((role) => (
            <label
              key={role.value}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedRole === role.value
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={selectedRole === role.value}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={isLoading || currentRole === role.value}
                className="mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{role.label}</p>
                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Advertencia */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">ℹ️ Nota:</span> Al cambiar de rol, tu sesión se actualizará
            con los permisos del nuevo rol. Algunos datos pueden cambiar según el rol seleccionado.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700
              hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
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
            {isLoading ? "Cambiando..." : "Cambiar rol"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
