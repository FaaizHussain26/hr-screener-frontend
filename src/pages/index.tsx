import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import AuthMiddleware from "@/components/middleware/auth-middleware";
import GuestMiddleware from "@/components/middleware/guest-middleware";
import { Route, Routes } from "react-router";
import { AgentDetailsPage } from "./agent-details";
import { AnalyticsPage } from "./analytics";

import { ForgotPassword } from "./forgot-password";
import LoginPage from "./login";
import RegisterPage from "./register";
import { ResetPassword } from "./reset-password";
import { SettingsPage } from "./settings";
import { JobModulePage } from "./job-module";
import { UsersPage } from "./users";
import ShorlistCandidates from "./shortlisted-candidates";
import Dashboard from "./dashboard";

export default function Main() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestMiddleware>
            <LoginPage />
          </GuestMiddleware>
        }
      />
      <Route
        path="login"
        element={
          <GuestMiddleware>
            <LoginPage />
          </GuestMiddleware>
        }
      />
      <Route
        path="forgot-password"
        element={
          <GuestMiddleware>
            <ForgotPassword />
          </GuestMiddleware>
        }
      />
      <Route
        path="reset-password"
        element={
          <GuestMiddleware>
            <ResetPassword />
          </GuestMiddleware>
        }
      />
      <Route
        path="register"
        element={
          <GuestMiddleware>
            <RegisterPage />
          </GuestMiddleware>
        }
      />
      <Route
        path="dashboard"
        element={
          <AuthMiddleware>
            <DashboardLayout />
          </AuthMiddleware>
        }
      >
        <Route
          path="home"
          element={
            <AuthMiddleware>
              <Dashboard />
            </AuthMiddleware>
          }
        />
        <Route path="shortlist-candidates" element={<ShorlistCandidates />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="agents/:id" element={<AgentDetailsPage />} />
        <Route path="job-module" element={<JobModulePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
