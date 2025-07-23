import { DashboardLayout } from "@/components/dashboard-layout";
import AuthMiddleware from "@/components/middleware/auth-middleware";
import GuestMiddleware from "@/components/middleware/guest-middleware";
import { Route, Routes } from "react-router";
import { AgentDetailsPage } from "./agent-details";
import { AnalyticsPage } from "./analytics";
import { DashboardPage } from "./dashboard";
import { ForgotPassword } from "./forgot-password";
import LoginPage from "./login";
import RegisterPage from "./register";
import { ResetPassword } from "./reset-password";
import { SettingsPage } from "./settings";
import { UsersPage } from "./users";
import ShorlistCandidates from "./shortlisted-candidates";

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
              <DashboardPage />
            </AuthMiddleware>
          }
        />
        <Route path="shortlist-candidates" element={<ShorlistCandidates />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="agents/:id" element={<AgentDetailsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
