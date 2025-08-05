import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  jobId: string;
  totalApplicants: number;
  strongMatch: number;
  potentialMatch: number;
  irrelevant: number;
  department: string;
  location: string;
  datePosted: string;
}

interface JobListProps {
  onJobSelect?: (job: Job) => void;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    jobId: "JHR-2024-001",
    totalApplicants: 45,
    strongMatch: 8,
    potentialMatch: 15,
    irrelevant: 22,
    department: "Engineering",
    location: "San Francisco, CA",
    datePosted: "2024-01-15",
  },
  {
    id: "2",
    title: "Product Manager",
    jobId: "JHR-2024-002",
    totalApplicants: 32,
    strongMatch: 5,
    potentialMatch: 12,
    irrelevant: 15,
    department: "Product",
    location: "New York, NY",
    datePosted: "2024-01-12",
  },
  {
    id: "3",
    title: "UX Designer",
    jobId: "JHR-2024-003",
    totalApplicants: 28,
    strongMatch: 6,
    potentialMatch: 10,
    irrelevant: 12,
    department: "Design",
    location: "Remote",
    datePosted: "2024-01-10",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    jobId: "JHR-2024-004",
    totalApplicants: 18,
    strongMatch: 3,
    potentialMatch: 8,
    irrelevant: 7,
    department: "Engineering",
    location: "Austin, TX",
    datePosted: "2024-01-08",
  },
];

export const DashboardPage = ({ onJobSelect }: JobListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredJobs = mockJobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        filterDepartment === "all" || job.department === filterDepartment;

      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      if (sortBy === "date")
        return (
          new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
        );
      if (sortBy === "applicants") return b.totalApplicants - a.totalApplicants;
      if (sortBy === "matches") return b.strongMatch - a.strongMatch;
      return 0;
    });

  const getMatchPercentage = (strongMatch: number, total: number) => {
    return total > 0 ? Math.round((strongMatch / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date Posted</SelectItem>
            <SelectItem value="applicants">Total Applicants</SelectItem>
            <SelectItem value="matches">Strong Matches</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {job.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {job.jobId} • {job.department} • {job.location}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getMatchPercentage(job.strongMatch, job.totalApplicants)}%
                  match rate
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{job.totalApplicants} total applicants</span>
                <span>•</span>
                <span>
                  Posted {new Date(job.datePosted).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-semibold text-green-700">
                      {job.strongMatch}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 font-medium">
                    Strong Match
                  </p>
                </div>

                <div className="text-center p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-lg font-semibold text-yellow-700">
                      {job.potentialMatch}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-600 font-medium">
                    Potential
                  </p>
                </div>

                <div className="text-center p-2 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-lg font-semibold text-red-700">
                      {job.irrelevant}
                    </span>
                  </div>
                  <p className="text-xs text-red-600 font-medium">Irrelevant</p>
                </div>
              </div>

              <Button
                onClick={() => onJobSelect && onJobSelect(job)}
                className="w-full "
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Applicants
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No jobs found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
