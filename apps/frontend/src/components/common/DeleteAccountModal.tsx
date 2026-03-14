import { useState } from "react";
import { Modal } from "./Modal";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== "ELIMINAR PERMANENTEMENTE" || !acceptedTerms) {
      return;
    }

    try {
      await onConfirm();
      handleClose();
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    setAcceptedTerms(false);
    onClose();
  };

  const isFormValid = confirmText === "ELIMINAR PERMANENTEMENTE" && acceptedTerms && !isLoading;

  return (
    <Modal open={open}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-red-600">Eliminar cuenta permanentemente</h2>
            <p className="text-sm text-gray-600 mt-1">Esta acción no se puede deshacer</p>
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

        {/* Advertencia */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ Advertencia importante
          </p>
          <ul className="text-sm text-red-600 space-y-1 ml-4 list-disc">
            <li>Tu cuenta será eliminada permanentemente</li>
            <li>Todos tus datos serán borrados</li>
            <li>No podrás recuperar tu cuenta</li>
            <li>Esta acción es irreversible</li>
          </ul>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          {/* Confirmación de texto */}
          <div>
            <label className="text-sm font-medium text-gray-700 ml-1 block mb-1.5">
              Escribe "ELIMINAR PERMANENTEMENTE" para confirmar
            </label>
            <input
              type="text"
              placeholder="ELIMINAR PERMANENTEMENTE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              disabled={isLoading}
              className="w-full bg-white border border-red-300 rounded-lg px-3 py-2.5
                text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Debes escribir exactamente el texto para continuar
            </p>
          </div>

          {/* Aceptar términos */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="accept-deletion"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              disabled={isLoading}
              className="mt-1 rounded border-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="accept-deletion" className="text-sm text-gray-600 cursor-pointer">
              Entiendo que mi cuenta y todos mis datos serán eliminados permanentemente
            </label>
          </div>
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
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white
              hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              font-medium text-sm"
          >
            {isLoading ? "Eliminando..." : "Eliminar cuenta"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
