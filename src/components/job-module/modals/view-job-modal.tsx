"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Clock, FileText, Calendar } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";

interface Job {
  _id: string;
  title: string;
  experience: string;
  summary: string;
  description: string;
  skills: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ViewJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

export function ViewJobModal({ open, onOpenChange, job }: ViewJobModalProps) {
  if (!job) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl overflow-hidden">
        <SheetHeader className="space-y-3 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="h-5 w-5" />
            Job Details
          </SheetTitle>
          <SheetDescription>
            Detailed information about {job.title}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Job Title
                    </label>
                    <p className="text-lg font-semibold">{job.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Experience Required
                    </label>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {job.experience}
                      </Badge>
                    </div>
                  </div>
                </div>

                {job.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created Date
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{job.summary}</p>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Required Skills
                  <Badge variant="secondary" className="ml-2">
                    {job.skills.length} skills
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.skills && job.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No skills specified
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            {job.updatedAt && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-muted-foreground">
                        Job ID
                      </label>
                      <p className="font-mono text-xs bg-muted px-2 py-1 rounded mt-1">
                        {job._id}
                      </p>
                    </div>
                    <div>
                      <>
                        <label className="font-medium text-muted-foreground">
                          Last Updated
                        </label>
                      </>
                      <p className="mt-1">
                        {new Date(job.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
