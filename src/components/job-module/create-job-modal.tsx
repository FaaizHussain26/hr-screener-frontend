"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, X } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateJob } from "@/api/hooks/job-module/useJobs";
import { useCreateSkill, useSkills } from "@/api/hooks/job-module/useSkills";

const addJobSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  experience: z.string().min(1, "Experience is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  jobDescription: z
    .string()
    .min(20, "Job description must be at least 20 characters"),
  selectedSkills: z
    .array(z.string())
    .min(1, "Please select at least one skill"),
});

export type AddJobFormData = z.infer<typeof addJobSchema>;

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<AddJobFormData>;
}

export const CreateJobModal = ({
  isOpen,
  onClose,
  initialData = {},
}: CreateJobModalProps) => {
  const form = useForm<AddJobFormData>({
    resolver: zodResolver(addJobSchema),
    defaultValues: {
      jobTitle: initialData.jobTitle || "",
      experience: initialData.experience || "",
      summary: initialData.summary || "",
      jobDescription: initialData.jobDescription || "",
      selectedSkills: initialData.selectedSkills || [],
    },
  });

  const [skillInput, setSkillInput] = useState("");
  const selectedSkills = form.watch("selectedSkills");

  // Hooks
  const createJobMutation = useCreateJob();
  const createSkillMutation = useCreateSkill();
  const { data: suggestedSkills = [] } = useSkills(skillInput);

  // Filter out already selected skills
  const filteredSuggestions = suggestedSkills.filter(
    (skill) => !selectedSkills.includes(skill.name)
  );

  const handleAddSkill = async (value?: string) => {
    const skill = (value || skillInput).trim();
    if (!skill) return;

    if (selectedSkills.includes(skill)) {
      return;
    }

    // Check if skill exists in suggestions
    const existingSkill = suggestedSkills.find(
      (s) => s.name.toLowerCase() === skill.toLowerCase()
    );

    if (!existingSkill) {
      // Create new skill
      try {
        await createSkillMutation.mutateAsync(skill);
      } catch (error) {
        console.error("Failed to create skill:", error);
        return;
      }
    }

    // Add skill to form
    form.setValue("selectedSkills", [...selectedSkills, skill], {
      shouldValidate: true,
    });
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    form.setValue(
      "selectedSkills",
      selectedSkills.filter((s) => s !== skill),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: AddJobFormData) => {
    try {
      await createJobMutation.mutateAsync(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setSkillInput("");
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Title */}
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience */}
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 3+ years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Job summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Job Description */}
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed job description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills */}
            <FormField
              control={form.control}
              name="selectedSkills"
              render={() => (
                <FormItem>
                  <FormLabel>Required Skills</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search or add a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddSkill()}
                      disabled={
                        !skillInput.trim() || createSkillMutation.isPending
                      }
                    >
                      {createSkillMutation.isPending ? "Adding..." : "Add"}
                    </Button>
                  </div>
                  {filteredSuggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {filteredSuggestions.map((skill) => (
                        <Badge
                          key={skill._id}
                          onClick={() => handleAddSkill(skill.name)}
                          className="cursor-pointer bg-muted hover:bg-muted/80"
                        >
                          + {skill.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <CardContent className="mt-3 border rounded p-2 max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {skill}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createJobMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createJobMutation.isPending}>
                {createJobMutation.isPending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full mr-2 border-b-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Job
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
