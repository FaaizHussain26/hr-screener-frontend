"use client";

import type React from "react";

import { Eye, Filter, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortlistCandidateData } from "@/utils/Content-Data/shortlist-candidate-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { useShortListedCandidates } from "@/api/hooks/useShortListedCandidates";

interface ShortListedCandidate {
  id: number;
  applicant_name: string;
  job_matched: string;
  match_score: number;
  experience: {
    years_found: number;
    match: "yes" | "no";
  };
}

const ITEMS_PER_PAGE = 5;

export function AgentsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: shortListedCandidates = [] } = useShortListedCandidates();
  console.log(shortListedCandidates, "shortListedCandidates");
  const handleAgentClick = (allCandidatesId: number) => {
    navigate(`/shortlist-candidates/${allCandidatesId}`);
  };

  const filteredCandidates = useMemo(() => {
    return shortListedCandidates?.filter((candidate: ShortListedCandidate) => {
      const matchesSearch =
        candidate.applicant_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        candidate.job_matched
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        candidate.match_score.toString().includes(searchTerm.toLowerCase()) ||
        candidate.experience.toString().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, shortListedCandidates]);

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getBadgeClassName = (score: number) => {
    if (score >= 90) {
      return cn(
        "bg-green-700 text-white border-0 relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
        "before:translate-x-[-100%] before:animate-[shimmer_1.5s_infinite]"
      );
    } else if (score >= 80) {
      return "bg-green-400 text-white border-0 relative overflow-hidden";
    } else if (score >= 70) {
      return "bg-yellow-400 text-black border-0 relative overflow-hidden";
    } else {
      return "bg-red-500 text-white border-0 relative overflow-hidden";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {shortlistCandidateData.heading}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {shortlistCandidateData.subHeading}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder={shortlistCandidateData.searchBar}
              className="pl-4 w-full rounded-lg bg-sidebar-accent-foreground"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-sidebar-accent-foreground">
              <Filter className="mr-2 h-4 w-4 text-card-box" />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-8">
                    {shortlistCandidateData.tableColumn.tableColumnOne}
                  </TableHead>
                  <TableHead>
                    {shortlistCandidateData.tableColumn.tableColumnTwo}
                  </TableHead>
                  <TableHead>
                    {shortlistCandidateData.tableColumn.tableColumnThree}
                  </TableHead>
                  <TableHead>
                    {shortlistCandidateData.tableColumn.tableColumnFour}
                  </TableHead>
                  <TableHead>
                    {shortlistCandidateData.tableColumn.tableColumnFive}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCandidates.length > 0 ? (
                  paginatedCandidates.map((candidate: ShortListedCandidate) => (
                    <TableRow
                      key={candidate.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium text-gray-900 whitespace-nowrap pl-8">
                        {candidate.applicant_name}
                      </TableCell>
                      <TableCell className="text-gray-600 whitespace-nowrap">
                        <Badge
                          variant={
                            candidate.job_matched === "Yes"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            candidate.job_matched === "Yes"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }
                        >
                          {candidate.job_matched}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 whitespace-nowrap">
                        {candidate.experience.years_found > 0
                          ? `${candidate.experience.years_found} years`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-600 whitespace-nowrap">
                        <Badge
                          className={getBadgeClassName(candidate.match_score)}
                        >
                          {`${candidate.match_score.toLocaleString()}%`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleAgentClick(candidate.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No candidates found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredCandidates.length > 0 && (
            <div className="border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {filteredCandidates.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredCandidates.length)}{" "}
            of {filteredCandidates.length} candidates
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}
