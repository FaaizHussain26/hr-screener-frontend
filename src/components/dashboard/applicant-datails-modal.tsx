import { Dialog, DialogTitle } from "@/components/ui/dialog";
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
import { useState } from "react";
import {
  Search,
  Star,
  Mail,
  MapPin,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import {
  DialogContent,
  DialogHeader,
} from "../ui/dialog-applicant-detail-model";
import { Job } from "@/pages/dashboard";

interface Applicant {
  id: string;
  name: string;
  email: string;
  score: number;
  classification: "Strong Match" | "Potential Match" | "Irrelevant";
  experience: string;
  location: string;
  skills: string[];
  appliedDate: string;
  resumeUrl?: string;
}

interface ApplicantDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock applicants data
const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    score: 92,
    classification: "Strong Match",
    experience: "5+ years",
    location: "San Francisco, CA",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    appliedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    score: 78,
    classification: "Potential Match",
    experience: "3 years",
    location: "New York, NY",
    skills: ["JavaScript", "React", "Python"],
    appliedDate: "2024-01-14",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    score: 35,
    classification: "Irrelevant",
    experience: "1 year",
    location: "Austin, TX",
    skills: ["HTML", "CSS", "WordPress"],
    appliedDate: "2024-01-13",
  },
  {
    id: "4",
    name: "David Park",
    email: "david.park@email.com",
    score: 85,
    classification: "Strong Match",
    experience: "4 years",
    location: "Seattle, WA",
    skills: ["React", "Node.js", "PostgreSQL", "Docker"],
    appliedDate: "2024-01-12",
  },
  {
    id: "5",
    name: "Lisa Wong",
    email: "lisa.wong@email.com",
    score: 67,
    classification: "Potential Match",
    experience: "2 years",
    location: "Los Angeles, CA",
    skills: ["JavaScript", "Vue.js", "MySQL"],
    appliedDate: "2024-01-11",
  },
];

export const ApplicantDetailModal = ({
  job,
  isOpen,
  onClose,
}: ApplicantDetailModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClassification, setFilterClassification] =
    useState<string>("all");
  const [sortBy, setSortBy] = useState("score");

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Strong Match":
        return "bg-green-50 text-green-700 border-green-200";
      case "Potential Match":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Irrelevant":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredApplicants = mockApplicants
    .filter((applicant) => {
      const matchesSearch =
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterClassification === "all" ||
        applicant.classification === filterClassification;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date")
        return (
          new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        );
      return 0;
    });

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Score",
      "Classification",
      "Experience",
      "Location",
      "Skills",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredApplicants.map((applicant) =>
        [
          applicant.name,
          applicant.email,
          applicant.score,
          applicant.classification,
          applicant.experience,
          applicant.location,
          `"${applicant.skills.join("; ")}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${job?.jobId}-applicants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col ">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">
            {job.title} - Applicants
          </DialogTitle>
          <p className="text-muted-foreground">
            {job.jobId} • {filteredApplicants.length} of {job.totalApplicants}{" "}
            applicants
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row gap-4 flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterClassification}
              onValueChange={setFilterClassification}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Classifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                <SelectItem value="Strong Match">Strong Match</SelectItem>
                <SelectItem value="Potential Match">Potential Match</SelectItem>
                <SelectItem value="Irrelevant">Irrelevant</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Match Score</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Application Date</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleExportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Applicants Table */}
          <div className="flex-1 overflow-auto border rounded-lg">
            <div className="min-w-full">
              <div className="bg-muted/50 px-6 py-3 border-b">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-3">Candidate</div>
                  <div className="col-span-3">Contact</div>
                  <div className="col-span-2">Score</div>
                  <div className="col-span-2">Classification</div>
                  <div className="col-span-2">Applied</div>
                </div>
              </div>

              <div className="divide-y">
                {filteredApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="px-6 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3">
                        <div>
                          <p className="font-medium">{applicant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {applicant.experience} experience
                          </p>
                        </div>
                      </div>

                      <div className="col-span-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {applicant.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {applicant.location}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-xl font-bold">
                            {applicant.score}%
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <Badge
                          className={getClassificationColor(
                            applicant.classification
                          )}
                        >
                          {applicant.classification}
                        </Badge>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(applicant.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {applicant.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {filteredApplicants.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-center py-8">
              <div>
                <Filter className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No applicants found matching your criteria.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
