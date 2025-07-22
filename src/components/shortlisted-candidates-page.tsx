"use client";

import { useDeleteShortListedCandidates } from "@/api/hooks/useDeleteShortListedCandidate";
import { useShortListedCandidates } from "@/api/hooks/useShortListedCandidates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shortlistCandidateData } from "@/utils/Content-Data/shortlist-candidate-data";
import { Eye, Filter, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "./modals/delete-confirmation";

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

const ITEMS_PER_PAGE = 4;

export function ShortlistedCandidatesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  // const [tab, setTab] = useState("active");
  const [candidateToDelete, setCandidateToDelete] =
    useState<ShortListedCandidate | null>(null);

  const {
    data: shortListedCandidates,
    isError,
    error,
  } = useShortListedCandidates({
    page: currentPage,
    search: searchTerm,
    limit: ITEMS_PER_PAGE,
  });

  const { mutate: deleteCandidate, isPending: isDeleting } =
    useDeleteShortListedCandidates();

  const handleDeleteClick = () => {
    deleteCandidate(candidateToDelete?._id as string);
    setCandidateToDelete(null);
  };

  const allCandidates = shortListedCandidates?.data || [];
  // const visibleCandidates = allCandidates.filter(
  //   (c: { isDeleted: boolean }) => !c.isDeleted
  // );
  // const deletedCandidates = allCandidates.filter(
  //   (c: { isDeleted: boolean }) => c.isDeleted
  // );
  const lastPages = shortListedCandidates?.last_page || 1;

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getBadgeClassName = (score: number) => {
    if (score >= 90) return "bg-green-800 text-white animate-pulse";
    if (score >= 80) return "bg-green-400 text-white";
    if (score >= 70) return "bg-yellow-400 text-black";
    return "bg-red-500 text-white";
  };

  const renderPagination = () => {
    if (lastPages <= 1) return null;
    const pages = [];
    const maxVisiblePages = ITEMS_PER_PAGE;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(lastPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    pages.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === lastPages}
      >
        Next
      </Button>
    );

    return <div className="flex gap-2 justify-center mt-4">{pages}</div>;
  };

  const renderCandidateRows = (candidates: ShortListedCandidate[]) => (
    <>
      {candidates.length > 0 ? (
        candidates.map((candidate) => (
          <TableRow key={candidate._id} className="text-center">
            <TableCell className="text-left pl-10">
              {candidate.applicant_name}
            </TableCell>
            <TableCell className="text-center">
              <Badge
                className={
                  candidate.job_matched === "No"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800 "
                }
              >
                {candidate.job_matched}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              {candidate.experience?.years_found > 0
                ? `${candidate.experience.years_found} years`
                : "N/A"}
            </TableCell>
            <TableCell className="text-center">
              <Badge className={getBadgeClassName(candidate.match_score)}>
                {`${candidate.match_score}%`}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge
                className={
                  candidate.isDeleted
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800 "
                }
              >
                {candidate.isDeleted ? "Yes" : "No"}
              </Badge>
            </TableCell>

            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
                <Eye className="h-4 w-4 hover:text-blue-500 cursor-pointer" />
                <Trash2
                  onClick={() => setCandidateToDelete(candidate)}
                  className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer"
                />
                {/* {!candidate.isDeleted && (
                  <Trash2
                    onClick={() => setCandidateToDelete(candidate)}
                    className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer"
                  />
                )} */}
              </div>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={6}
            className="text-center py-8 text-muted-foreground"
          >
            No candidates found.
          </TableCell>
        </TableRow>
      )}
    </>
  );

  if (isError) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="text-center text-red-600">
          Error loading candidates:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {shortlistCandidateData.heading}
          </h2>
          <p className="text-muted-foreground text-sm">
            {shortlistCandidateData.subHeading}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Input
              placeholder={shortlistCandidateData.searchBar}
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-4 w-full sm:w-64"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      {/* <Tabs value={tab} onValueChange={setTab} className="w-full"> */}
      {/* <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="deleted">Deleted</TabsTrigger>
        </TabsList> */}

      {/* <TabsContent value="active"> */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="text-left pl-10">
                  {shortlistCandidateData.tableColumn.tableColumnOne}
                </TableHead>
                <TableHead className="text-center">
                  {shortlistCandidateData.tableColumn.tableColumnTwo}
                </TableHead>
                <TableHead className="text-center">
                  {shortlistCandidateData.tableColumn.tableColumnThree}
                </TableHead>
                <TableHead className="text-center">
                  {shortlistCandidateData.tableColumn.tableColumnFour}
                </TableHead>
                <TableHead className="text-center">
                  {shortlistCandidateData.tableColumn.tableColumnFive}
                </TableHead>
                <TableHead className="text-center w-[120px]">
                  {shortlistCandidateData.tableColumn.tableColumnSix}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderCandidateRows(allCandidates)}</TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* </TabsContent> */}

      {/* <TabsContent value="deleted">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-center">
                    <TableHead className="text-left pl-10">
                      {shortlistCandidateData.tableColumn.tableColumnOne}
                    </TableHead>
                    <TableHead className="text-center">
                      {shortlistCandidateData.tableColumn.tableColumnTwo}
                    </TableHead>
                    <TableHead className="text-center">
                      {shortlistCandidateData.tableColumn.tableColumnThree}
                    </TableHead>
                    <TableHead className="text-center">
                      {shortlistCandidateData.tableColumn.tableColumnFour}
                    </TableHead>
                    <TableHead className="text-center w-[120px]">
                      {shortlistCandidateData.tableColumn.tableColumnFive}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderCandidateRows(deletedCandidates)}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent> */}
      {/* </Tabs> */}

      <DeleteConfirmationModal
        open={!!candidateToDelete}
        onOpenChange={() => setCandidateToDelete(null)}
        onClickConfirm={handleDeleteClick}
        loading={isDeleting}
      />

      {renderPagination()}
    </div>
  );
}
