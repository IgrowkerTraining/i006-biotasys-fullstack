interface PersonalDataItem {
  label: string;
  value: string;
  onEdit?: () => void;
}

interface PersonalDataSectionProps {
  items: PersonalDataItem[];
  passwordLastUpdated?: string;
  onChangePassword?: () => void;
  isUnified?: boolean;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({
  items,
  passwordLastUpdated,
  onChangePassword,
  isUnified = false,
}) => {
  return (
    <div className={isUnified ? "p-6" : "bg-white rounded-lg border border-gray-200 p-6"}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Datos personales
      </h3>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start pb-6 border-b border-gray-200"
          >
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                {item.label}
              </label>
              <p className="text-sm text-gray-900 mt-2">{item.value}</p>
            </div>
            {item.onEdit && (
              <button
                onClick={item.onEdit}
                className="ml-4 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700
                  hover:bg-indigo-50 rounded transition-colors"
              >
                Editar
              </button>
            )}
          </div>
        ))}

        {/* Contraseña */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Contraseña
            </label>
            {passwordLastUpdated && (
              <p className="text-sm text-gray-900 mt-2">
                Actualizada al {passwordLastUpdated}
              </p>
            )}
          </div>
          {onChangePassword && (
            <button
              onClick={onChangePassword}
              className="ml-4 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700
                hover:bg-indigo-50 rounded transition-colors"
            >
              Cambiar contraseña
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
