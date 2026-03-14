interface Device {
  name: string;
  os: string;
  location: string;
  lastActive?: string;
}

interface ActiveDevicesSectionProps {
  devices: Device[];
  onLogoutAll?: () => void;
  isUnified?: boolean;
}

export const ActiveDevicesSection: React.FC<ActiveDevicesSectionProps> = ({
  devices,
  onLogoutAll,
  isUnified = false,
}) => {
  return (
    <div className={isUnified ? "border-l border-gray-200 p-6" : "bg-white rounded-lg border border-gray-200 p-6"}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Dispositivos activos
      </h3>

      <div className="space-y-4 mb-6">
        {devices.map((device, index) => (
          <div
            key={index}
            className="flex items-start justify-between pb-4 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {device.os.includes("Chrome") ? (
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.9 10.9C17.4 7.9 14.8 5.5 11.7 5.5c-2.4 0-4.6 1.3-5.7 3.3-.6.1-1.2.2-1.8.2C2.1 9 .5 10.6.5 12.5s1.6 3.5 3.7 3.5h12.4c2.5 0 4.7-1.8 5.2-4.1" />
                  </svg>
                )}
                <span className="font-medium text-gray-900">{device.name}</span>
              </div>
              <p className="text-sm text-gray-600">
                {device.os} - {device.location}
              </p>
              {device.lastActive && (
                <p className="text-xs text-gray-500 mt-1">
                  {device.lastActive}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {onLogoutAll && (
        <button
          onClick={onLogoutAll}
          className="w-full px-4 py-2.5 border border-indigo-600 text-indigo-600 rounded-lg
            hover:bg-indigo-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cerrar sesión
        </button>
      )}
    </div>
  );
};
