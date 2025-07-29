import {
  Clock,
  FilePlus,
  MessageSquare,
  MoreHorizontal,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usersData } from "@/utils/Content-Data/users-data";
import { useUsers } from "@/api/hooks/useUsers";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { jobModulePageData } from "@/utils/Content-Data/job-module-data";

import { useState } from "react";
import { CreateJobModal } from "@/components/job-module/add-job-modal";

const dummyData = {
  stats: [
    {
      title: jobModulePageData.card.cardOne,
      value: "12,847",
      change: "2",
      icon: MessageSquare,
    },
    {
      title: jobModulePageData.card.cardTwo,
      value: "2,847",
      change: "5",
      icon: Users,
    },
    {
      title: jobModulePageData.card.cardThree,
      value: "1.2s",
      change: "7",
      icon: Clock,
    },
  ],
};

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
}

interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export function JobModulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const { data, isLoading, isError } = useUsers({} as UsersQueryParams);
  const users: User[] = data?.results || [];

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Loading users...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-500">
        Failed to load users.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {jobModulePageData.heading}
          </h2>
          <p className="text-muted-foreground">
            {jobModulePageData.subHeading}
          </p>
        </div>
        <Button onClick={handleOpenModal}>
          <FilePlus className=" h-4 w-4" />
          <div className="ml-0">{jobModulePageData.button}</div>
        </Button>
        <CreateJobModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dummyData.stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{usersData.tableColumn.tableColumnOne}</TableHead>
                <TableHead>{usersData.tableColumn.tableColumnTwo}</TableHead>
                <TableHead>{usersData.tableColumn.tableColumnThree}</TableHead>
                <TableHead>{usersData.tableColumn.tableColumnFour}</TableHead>
                <TableHead>{usersData.tableColumn.tableColumnFive}</TableHead>
                <TableHead className="text-right">
                  {usersData.tableColumn.tableColumnSix}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isActive ? "active" : "inactive"}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          {/* <Mail className="mr-2 h-4 w-4" /> */}
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
