import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuth } from "../../hooks/useAuth";
import { ChangePersonalDataModal } from "../../components/common/ChangePersonalDataModal";
import { ChangeLaboratoryModal } from "../../components/common/ChangeLaboratoryModal";
import { ChangeEmailModal } from "../../components/common/ChangeEmailModal";
import { ChangePasswordModal } from "../../components/common/ChangePasswordModal";
import { DeleteAccountModal } from "../../components/common/DeleteAccountModal";
import { ChangeRoleModal } from "../../components/common/ChangeRoleModal";
import { ProfileCard } from "../../components/user/ProfileCard";
import { PersonalDataSection } from "../../components/user/PersonalDataSection";
import { ActiveDevicesSection } from "../../components/user/ActiveDevicesSection";
import { AccountManagementSection } from "../../components/user/AccountManagementSection";

interface Device {
  name: string;
  os: string;
  location: string;
  lastActive?: string;
}

export const User = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { userProfile, loading: profileLoading, error: profileError, updateProfile, updateLaboratory, updateEmail, changePassword, deleteAccount, changeRole, refetch } = useUserProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLaboratoryModalOpen, setIsLaboratoryModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [changeRoleLoading, setChangeRoleLoading] = useState(false);

  // Dispositivos activos (placeholder - esto se podría cargar de un endpoint también)
  const activeDevices: Device[] = [
    {
      name: "Chrome - macOS",
      os: "Chrome · macOS",
      location: "La Plata",
      lastActive: "Ahora mismo",
    },
    {
      name: "Safari - macOS",
      os: "Safari · macOS",
      location: "La Plata",
      lastActive: "Hace 1h",
    },
    {
      name: "Safari - macOS",
      os: "Safari · macOS",
      location: "La Plata",
      lastActive: "Hace 3h",
    },
  ];

  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmChanges = async (data: {
    fullName: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await updateProfile(data.fullName, data.password);
      alert("¡Nombre actualizado correctamente!");
      setIsModalOpen(false);
      await refetch();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el nombre";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenLaboratoryModal = () => {
    setIsLaboratoryModalOpen(true);
  };

  const handleCloseLaboratoryModal = () => {
    setIsLaboratoryModalOpen(false);
  };

  const handleConfirmLaboratoryChanges = async (data: {
    laboratory: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await updateLaboratory(data.laboratory, data.password);
      alert("¡Centro adscrito actualizado correctamente!");
      setIsLaboratoryModalOpen(false);
      await refetch();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el centro adscrito";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEmailModal = () => {
    setIsEmailModalOpen(true);
  };

  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
  };

  const handleConfirmEmailChanges = async (data: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await updateEmail(data.email, data.password);
      alert("¡Correo electrónico actualizado correctamente!");
      setIsEmailModalOpen(false);
      await refetch();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el correo electrónico";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleConfirmPasswordChanges = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      alert("¡Contraseña cambiada correctamente!");
      setIsPasswordModalOpen(false);
      await refetch();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cambiar la contraseña";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      // Llamar a tu API para cerrar todas las sesiones
      console.log("Cerrando todas las sesiones");
    } catch (error) {
      console.error("Error al cerrar sesiones:", error);
    }
  };

  const handleChangeRole = () => {
    setIsChangeRoleModalOpen(true);
  };

  const handleOpenChangeRoleModal = () => {
    setIsChangeRoleModalOpen(true);
  };

  const handleCloseChangeRoleModal = () => {
    setIsChangeRoleModalOpen(false);
  };

  const handleConfirmChangeRole = async (newRole: string) => {
    setChangeRoleLoading(true);
    try {
      await changeRole(newRole);
      alert("¡Rol cambiado correctamente!");
      setIsChangeRoleModalOpen(false);
      await refetch();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cambiar el rol";
      alert(`Error: ${errorMessage}`);
    } finally {
      setChangeRoleLoading(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccount();
      alert("¡Tu cuenta ha sido eliminada permanentemente!");
      // Redirigir al login después de eliminar
      setTimeout(() => {
        navigate("/login");
        // Limpiar cualquier dato de sesión
        localStorage.clear();
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar la cuenta";
      alert(`Error: ${errorMessage}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      // Llamar a tu API para eliminar cuenta
      console.log("Eliminando cuenta");
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Si aún está cargando, mostrar esqueleto de carga
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Error al cargar el perfil</p>
            <p className="text-red-500 text-sm mt-2">{profileError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay datos de usuario, mostrar mensaje
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-600 font-medium">No se pudieron cargar los datos del usuario</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center w-10 h-10 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label="Ir atrás"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Mi perfil</h1>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard
              fullName={userProfile.fullName}
              initials={getInitials(userProfile.fullName)}
              activeRole={userProfile.role || authUser?.role || "Sin rol asignado"}
              userId={userProfile.id}
              studiesCount={0} // TODO: Obtener datos de estudios del usuario
              requestingNutritionists={[]} // TODO: Obtener solicitudes de nutricionistas
            />
          </div>

          {/* Middle and Right columns */}
          <div className="lg:col-span-2">
            {/* Bloque unificado: Datos personales, Dispositivos activos y Gestión de cuenta */}
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Datos personales y Dispositivos activos lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Datos personales */}
                <PersonalDataSection
                  items={[
                    {
                      label: "Nombre completo",
                      value: userProfile.fullName,
                      onEdit: handleOpenModal,
                    },
                    {
                      label: "Centro adscrito",
                      value: userProfile.laboratory || "Sin asignar",
                      onEdit: handleOpenLaboratoryModal,
                    },
                    {
                      label: "Correo electrónico",
                      value: userProfile.email,
                      onEdit: handleOpenEmailModal,
                    },
                  ]}
                  passwordLastUpdated={userProfile.updatedAt ? new Date(userProfile.updatedAt).toLocaleDateString("es-ES") : undefined}
                  onChangePassword={handleOpenPasswordModal}
                  isUnified={true}
                />

                {/* Dispositivos activos */}
                <ActiveDevicesSection
                  devices={activeDevices}
                  onLogoutAll={handleLogoutAll}
                  isUnified={true}
                />
              </div>

              {/* Gestión de cuenta */}
              <AccountManagementSection
                onChangeRole={handleChangeRole}
                onDeleteAccount={handleOpenDeleteModal}
                changeRoleLoading={changeRoleLoading}
                deleteAccountLoading={deleteLoading}
                isUnified={true}
                currentRole={userProfile.role || authUser?.role || "Sin rol asignado"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de cambio de datos personales */}
      <ChangePersonalDataModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmChanges}
        currentFullName={userProfile.fullName}
        isLoading={isLoading}
      />

      {/* Modal de cambio de centro adscrito */}
      <ChangeLaboratoryModal
        open={isLaboratoryModalOpen}
        onClose={handleCloseLaboratoryModal}
        onConfirm={handleConfirmLaboratoryChanges}
        currentLaboratory={userProfile.laboratory || ""}
        isLoading={isLoading}
      />

      {/* Modal de cambio de correo electrónico */}
      <ChangeEmailModal
        open={isEmailModalOpen}
        onClose={handleCloseEmailModal}
        onConfirm={handleConfirmEmailChanges}
        currentEmail={userProfile.email}
        isLoading={isLoading}
      />

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        onConfirm={handleConfirmPasswordChanges}
        isLoading={isLoading}
      />

      {/* Modal de eliminación de cuenta */}
      <DeleteAccountModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteAccount}
        isLoading={deleteLoading}
      />

      {/* Modal de cambio de rol */}
      <ChangeRoleModal
        open={isChangeRoleModalOpen}
        onClose={handleCloseChangeRoleModal}
        onConfirm={handleConfirmChangeRole}
        currentRole={authUser?.role?.toLowerCase() || "laboratorio"}
        isLoading={changeRoleLoading}
      />
    </div>
  );
};

