import { Outlet, useLocation, useNavigate } from "react-router";
import {
  Bot,
  Settings,
  Users,
  BarChart3,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCallback } from "react";
import { dashboardLayout } from "@/utils/Content-Data/dashboard-layout-data";
import useAuth from "@/hooks/useAuth";

export function DashboardLayout() {
  const { user } = useAuth();

  const data = {
    user: {
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    navMain: [
      {
        title: dashboardLayout.sideBar.sideBarOne,
        url: "/dashboard/home",
        icon: BarChart3,
      },
      {
        title: dashboardLayout.sideBar.sideBarTwo,
        url: "/dashboard/shortlist-candidates",
        icon: Bot,
      },
      {
        title: dashboardLayout.sideBar.sideBarSix,
        url: "/dashboard/job-module",
        icon: Bot,
      },
      {
        title: dashboardLayout.sideBar.sideBarThree,
        url: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        title: dashboardLayout.sideBar.sideBarFour,
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: dashboardLayout.sideBar.sideBarFive,
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  };
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(url);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.startsWith("/agents/create")) return "Create AI Agent";
    if (path.startsWith("/agents/") && path !== "/shortlist-candidates")
      return "Aplicant Details";
    if (path.startsWith("/shortlist-candidates")) return "Applicants";
    if (path.startsWith("/analytics")) return "Analytics";
    if (path.startsWith("/users")) return "Users";
    if (path.startsWith("/settings")) return "Settings";
    return dashboardLayout.header.heading;
  };

  const handleLogout = useCallback(() => {
    const token = localStorage.getItem("token");

    if (token) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  function getInitials(name: string): string {
    if (!name) return "";
    const [firstName = "", lastName = ""] = name.trim().split(" ");
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="flex items-center justify-center pointer-events-none"
                asChild
              >
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className="flex items-center gap-2 w-full"
                >
                  <div className="flex aspect-square size-17 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground bg-transparent ">
                    <img src={dashboardLayout.image} className=" " />
                  </div>
                  {/* <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">AI Agent Hub</span>
                    <span className="text-xs">Management Platform</span>
                  </div> */}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* <form>
            <SidebarGroup className="py-0">
              <SidebarGroupContent className="relative">
                <Label htmlFor="search" className="sr-only">
                  Search
                </Label>
                <SidebarInput
                  id="search"
                  placeholder="Search agents..."
                  className="pl-8"
                />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              </SidebarGroupContent>
            </SidebarGroup>
          </form> */}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <button
                        onClick={() => handleNavigation(item.url)}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleNavigation("/agents/create")}
                    >
                      <Plus className="size-4" />
                      Create Agent
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pointer-events-none mb-6  bg-sidebar-accent-active"
                  >
                    <Avatar className="h-10 w-10 rounded-full ">
                      <AvatarImage
                        src={data.user.avatar || "/placeholder.svg"}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg bg-card-box">
                        {getInitials(data.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight ">
                      <span className="truncate font-semibold">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user.avatar || "/placeholder.svg"}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {getInitials(data.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {data.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mt-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* <Button
                variant="outline"
                size="lg"
                className="bg-blue-900 text-white rounded-lg"
                onClick={() => handleNavigation("/agents/create")}
              >
                <Plus className="size-4 mr-2" />
                {dashboardLayout.header.headerAddButton}
              </Button> */}
              <div className="bg-sidebar-accent-foreground rounded-full">
                <Button variant="ghost" size="sm">
                  <Bell fill="currentColor" className="size-5 text-card-box" />
                </Button>
              </div>
              <div className="bg-sidebar-accent-foreground rounded-full">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>
        <Separator orientation="horizontal" className="mb-4 h-4" />
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
