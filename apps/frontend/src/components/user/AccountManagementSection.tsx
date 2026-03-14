interface AccountManagementSectionProps {
  onChangeRole?: () => void;
  onDeleteAccount?: () => void;
  changeRoleLoading?: boolean;
  deleteAccountLoading?: boolean;
  isUnified?: boolean;
  currentRole?: string;
}

const getOppositeRole = (currentRole?: string): string => {
  if (!currentRole) return "nutricionista";
  const lowerRole = currentRole.toLowerCase();
  return lowerRole.includes("nutricionista") ? "laboratorio" : "nutricionista";
};

export const AccountManagementSection: React.FC<AccountManagementSectionProps> = ({
  onChangeRole,
  onDeleteAccount,
  changeRoleLoading = false,
  deleteAccountLoading = false,
  isUnified = false,
  currentRole,
}) => {
  return (
    <div className={isUnified ? "border-t border-gray-200 p-6" : "bg-white rounded-lg border border-gray-200 p-6"}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Gestión de cuenta
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cambiar perfil profesional */}
        {onChangeRole && (
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Cambiar perfil profesional
              </p>
              <p className="text-xs text-gray-500 mb-4">
                *Vas a cambiar tu entorno de trabajo actual. Tus permisos y el acceso a la base de datos de pacientes se actualizarán según tu perfil.
              </p>
            </div>
            <button
              onClick={onChangeRole}
              disabled={changeRoleLoading}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg
                hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-50"
            >
              {changeRoleLoading ? "Cambiando..." : `Cambiar de rol a ${getOppositeRole(currentRole)}`}
            </button>
          </div>
        )}

        {/* Eliminar cuenta */}
        {onDeleteAccount && (
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Eliminar cuenta permanentemente
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
                <svg
                  className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800">
                  Al eliminar la cuenta se perderá la trazabilidad de todos los informes y fichas de pacientes asociados a tu cuenta.
                </p>
              </div>
            </div>
            <button
              onClick={onDeleteAccount}
              disabled={deleteAccountLoading}
              className="px-4 py-2.5 border border-red-600 text-red-600 rounded-lg
                hover:bg-red-50 transition-colors font-medium text-sm disabled:opacity-50"
            >
              {deleteAccountLoading ? "Eliminando..." : "Eliminar cuenta"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
