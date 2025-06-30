import { DashboardLayout } from "@/components/dashboard-layout";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AgentDetailsPage } from "./agent-details";
import { AgentsPage } from "./agents";
import { AnalyticsPage } from "./analytics";
import { DashboardPage } from "./dashboard";
import { UsersPage } from "./users";
import ChatWidget from "@/components/chatbot/chat-widget";

export default function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatWidget />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="home" element={<DashboardPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="agents/:id" element={<AgentDetailsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
