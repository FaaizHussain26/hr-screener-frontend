"use client";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";

import type { FilterState } from "../shortlisted-candidates-page";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Button } from "../ui/button";

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

export function FilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      matchScoreMin: null,
      matchScoreMax: null,
      summaryMatched: null,
      jobTitle: "",
    };
    setLocalFilters(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Candidates</DialogTitle>
          <DialogDescription>
            Apply filters to narrow down your candidate search.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Match Score Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Match Score Range (%)</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                min="0"
                max="100"
                value={localFilters.matchScoreMin || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    matchScoreMin: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className="w-20"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                min="0"
                max="100"
                value={localFilters.matchScoreMax || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    matchScoreMax: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className="w-20"
              />
            </div>
          </div>

          {/* Summary Matched */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Summary Matched</Label>
            <Select
              value={
                localFilters.summaryMatched === null
                  ? "all"
                  : localFilters.summaryMatched
                  ? "yes"
                  : "no"
              }
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  summaryMatched: value === "all" ? null : value === "yes",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Job Title</Label>
            <Input
              placeholder="Enter job title..."
              value={localFilters.jobTitle}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  jobTitle: e.target.value,
                })
              }
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
