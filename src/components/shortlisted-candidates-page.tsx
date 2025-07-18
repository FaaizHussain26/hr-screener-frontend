"use client";

import { Eye, Filter, MoreHorizontal, Search, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";

import { useShortListedCandidates } from "@/api/hooks/useShortListedCandidates";
import { Badge } from "@/components/ui/badge";
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
import { useDeleteShortListedCandidates } from "@/api/hooks/useDeleteShortListedCandidate";
import { Spinner } from "./ui/spinner";
// import { useNavigate } from "react-router";

interface ShortListedCandidate {
  _id: string;
  applicant_name: string;
  job_matched: string;
  match_score: number;
  deletedAt: string;
  isDeleted: boolean;
  experience: {
    years_found: number;
    match: "yes" | "no";
  };
}

const ITEMS_PER_PAGE = 7;

export function ShortlistedCandidatesPage() {
  // const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: shortListedCandidates,
    isLoading,
    isError,
    error,
  } = useShortListedCandidates({
    page: currentPage,
    search: searchTerm,
    limit: ITEMS_PER_PAGE,
  });

  const { mutate: deleteCandidate, isPending: isDeleting } =
    useDeleteShortListedCandidates();

  const handleDeleteClick = (candidateId: string) => {
    deleteCandidate(candidateId); // API expects string
  };

  // const handleCandidateClick = (candidateId: number) => {
  //   navigate(`/shortlist-candidates/${candidateId}`);
  // };

  const lastPages = shortListedCandidates?.last_page || 1;

  const paginatedCandidates = shortListedCandidates?.data || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const getBadgeClassName = (score: number) => {
    if (score >= 90) {
      return "bg-green-800 text-white border-0 relative overflow-hidden rounded-md animate-pulse";
    } else if (score >= 80) {
      return "bg-green-400 text-white border-0 relative overflow-hidden";
    } else if (score >= 70) {
      return "bg-yellow-400 text-black border-0 relative overflow-hidden";
    }

    return "bg-red-500 text-white border-0 relative overflow-hidden";
  };

  const renderPagination = () => {
    if (lastPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(lastPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2"
      >
        Previous
      </Button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }

    // Next button
    pages.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === lastPages}
        className="ml-2"
      >
        Next
      </Button>
    );

    return <div className="flex items-center justify-center mt-4">{pages}</div>;
  };

  if (isError) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-2">
              Error loading candidates
            </p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              className="pl-4 w-full rounded-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
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
                  <TableHead>
                    {shortlistCandidateData.tableColumn.tableColumnSix}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="pl-8">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
                {paginatedCandidates.length > 0 ? (
                  paginatedCandidates.map((candidate: ShortListedCandidate) => (
                    <TableRow
                      key={candidate._id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium text-gray-900 whitespace-nowrap pl-8">
                        {candidate.applicant_name}
                      </TableCell>
                      <TableCell className="text-gray-600 whitespace-nowrap">
                        <Badge
                          variant={
                            candidate.job_matched?.toLowerCase() === "yes"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            candidate.job_matched?.toLowerCase() === "yes"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }
                        >
                          {candidate.job_matched}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 whitespace-nowrap">
                        {candidate.experience?.years_found > 0
                          ? `${candidate.experience.years_found} years`
                          : "N/A"}
                      </TableCell>

                      <TableCell className="text-gray-600 whitespace-nowrap">
                        <Badge
                          className={getBadgeClassName(candidate.match_score)}
                        >
                          {`${candidate.match_score?.toLocaleString()}%`}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 whitespace-nowrap pl-8">
                        <Badge
                          className={
                            candidate.isDeleted
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }
                        >
                          {candidate.isDeleted ? "Yes" : "No"}
                        </Badge>
                        {/*
                        candidate deleted show here
                         */}
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
                            // onClick={() => handleCandidateClick(candidate.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(candidate._id)}
                              className="text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                              {isDeleting && (
                                <Spinner className="ml-1 h-3 w-3" />
                              )}
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
                      {searchTerm
                        ? "No candidates found matching your search criteria."
                        : "No candidates available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {shortListedCandidates?.data?.length > 0 && renderPagination()}
        </CardContent>
      </Card>

      {shortListedCandidates?.data?.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(
              currentPage * ITEMS_PER_PAGE,
              shortListedCandidates?.total || 0
            )}{" "}
            of {shortListedCandidates?.total || 0} candidates
          </div>
          <div>
            Page {currentPage} of {lastPages}
          </div>
        </div>
      )}
    </div>
  );
}
