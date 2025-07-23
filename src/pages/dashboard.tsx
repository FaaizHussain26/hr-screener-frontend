"use client";

import { useDashboardStats } from "@/api/hooks/useDashboardStats";
import { Activity, Bot, ChevronRight, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router"; // ✅ Fixed

import DashboardCard from "@/components/dashboard-card";
import { ShortlistedCandidatesPage } from "@/components/shortlisted-candidates-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: dashboardStats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Loading dashboard...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-500">
        Failed to load dashboard stats.
      </div>
    );
  }

  console.log(dashboardStats, "test");

  const statsCards = [
    {
      title: "Total Candidates",
      value: dashboardStats?.total_candidates ?? 0,
      icon: Bot,
    },
    {
      title: "Rejected Candidates",
      value: dashboardStats?.total_rejected_candidates ?? 0,
      icon: Activity,
    },
    {
      title: "Accepted Candidates",
      value: dashboardStats?.total_accepted_candidates ?? 0,
      icon: Clock,
    },
    {
      title: "Total Duplicate Candidates",
      value: dashboardStats?.total_duplicate_candidates ?? 0,
      icon: Zap,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 bg-card-back">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Recent Agents Table */}
      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center justify-between -mb-6">
            <div>
              <CardTitle className="font-bold">
                Shortlisted Candidates
              </CardTitle>
            </div>
            <Button
              className="flex items-center gap-0.5 text-sm bg-orange-100 rounded-full"
              variant="outline"
              onClick={() => navigate("/dashboard/shortlist-candidates")}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ShortlistedCandidatesPage
            limit={10}
            disablePagination
            disableFilters
          />
        </CardContent>
      </Card>
    </div>
  );
}
