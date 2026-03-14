import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Login from "../pages/login/Login";
import { RegisterPage } from "../pages/register/RegisterPage";
import { CreateStudyPage } from "../pages/studies/CreateStudy";
import { StudyReportPage } from "../pages/studies/StudyReportPage";
import { DashboardNutritionist } from "../pages/dashboard/DashboardNutritionist";
import { DashboardLaboratory } from "../pages/dashboard/DashboardLaboratory";
import { AcceptInvitationPage } from "../pages/AcceptInvitation";
import { PasswordRecovery } from "../pages/login/PasswordRecovery";
import { PasswordReset } from "../pages/login/PasswordReset";
import { ForgotPassword } from "../pages/login/ForgotPassword";
import { Navbar } from "../pages/Navbar";
import RegisterComplete from "../pages/register/RegisterComplete";
import { User } from "../pages/user/user.tsx"

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register-complete"
        element={
          <PublicRoute>
            <RegisterComplete />
          </PublicRoute>
        }
      />

      <Route
        path="/auth/verify-email"
        element={
          <PublicRoute>
            <RegisterComplete />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboardNutritionist"
        element={
          <ProtectedRoute role="nutricionista">
            <Navbar />
            <DashboardNutritionist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/studies/new"
        element={
          <ProtectedRoute role="nutricionista">
            <CreateStudyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/studies/:id/report"
        element={
          <ProtectedRoute role="nutricionista">
            <Navbar />
            <StudyReportPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/invitations/accept/:token" element={<AcceptInvitationPage />} />
      <Route path="/passwordRecovery" element={<PasswordRecovery />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/passwoedReset" element={<PasswordReset />} />
      <Route
        path="/dashboardLaboratory"
        element={
          <ProtectedRoute role="laboratorio">
            <Navbar />
            <DashboardLaboratory />
          </ProtectedRoute>

          
          
        }
      />

            <Route
        path="/profile"
        element={
            <><Navbar />
            <User/></>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
