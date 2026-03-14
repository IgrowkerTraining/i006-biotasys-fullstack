interface ProfileCardProps {
  fullName: string;
  initials: string;
  activeRole: string;
  userId: string;
  studiesCount: number;
  requestingNutritionists?: string[];
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  fullName,
  initials,
  activeRole,
  userId,
  studiesCount,
  requestingNutritionists = [],
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-xs">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-28 h-28 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-4xl font-bold text-indigo-600">{initials}</span>
        </div>
      </div>

      {/* Nombre */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
        {fullName}
      </h2>

      {/* Información */}
      <div className="space-y-4">
        {/* Rol activo */}
        <div className="pb-4 border-b border-gray-200">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Rol activo
          </label>
          <p className="text-sm text-gray-900 mt-2">{activeRole}</p>
        </div>

        {/* ID de usuario */}
        <div className="pb-4 border-b border-gray-200">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            ID de usuario
          </label>
          <p className="text-sm text-gray-900 mt-2">{userId}</p>
        </div>

        {/* Estudios cargados */}
        <div className="pb-4 border-b border-gray-200">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Estudios cargados
          </label>
          <p className="text-sm text-gray-900 mt-2 font-semibold">
            {studiesCount} estudios
          </p>
        </div>

        {/* Nutricionistas solicitantes */}
        {requestingNutritionists.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-3">
              Nutricionistas solicitantes
            </label>
            <div className="space-y-2">
              {requestingNutritionists.map((nutritionist, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  {nutritionist}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
