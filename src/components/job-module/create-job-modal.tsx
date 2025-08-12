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
// ...existing code...
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
import { Save } from "lucide-react";
import { useCreateJob } from "@/api/hooks/job-module/useJobs";
import { useCreateSkill, useSkills } from "@/api/hooks/job-module/useSkills";
import { useDebounce } from "use-debounce";
// ...existing code...

const addJobSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  experience: z.string().min(1, "Experience is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  description: z
    .string()
    .min(20, "Job description must be at least 20 characters"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
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
      title: initialData.title || "",
      experience: initialData.experience || "",
      summary: initialData.summary || "",
      description: initialData.description || "",
      skills: initialData.skills || [],
    },
  });

  const [skillInput, setSkillInput] = useState("");
  const skills = form.watch("skills");

  // Hooks
  const createJobMutation = useCreateJob();
  const createSkillMutation = useCreateSkill();
  const [debouncedSkillInput] = useDebounce(skillInput, 300);
  const { data: suggestedSkills = [] } = useSkills(debouncedSkillInput ?? "");

  // Filter out already selected skills
  const filteredSuggestions = suggestedSkills.filter(
    (skill) => !skills.includes(skill.technical_skill)
  );

  const handleAddSkill = async (value: string) => {
    const skill = value.trim();
    if (!skill || skills.includes(skill)) return;

    // Check if skill exists in suggestions
    const existingSkill = suggestedSkills.find(
      (s) => s.technical_skill.toLowerCase() === skill.toLowerCase()
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

    form.setValue("skills", [...skills, skill], {
      shouldValidate: true,
    });
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    form.setValue(
      "skills",
      skills.filter((s) => s !== skill),
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
              name="title"
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
              name="description"
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

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex items-center outline-1 text-black rounded-full px-3 py-1 text-sm font-medium shadow-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            className="ml-2 text-gray-400 hover:text-black focus:outline-none"
                            onClick={() => handleRemoveSkill(skill)}
                            aria-label={`Remove ${skill}`}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Add skill..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            await handleAddSkill(skillInput);
                          }
                        }}
                        className="pr-24"
                        autoComplete="off"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1 rounded-sm  "
                        onClick={async () => await handleAddSkill(skillInput)}
                        disabled={!skillInput.trim()}
                      >
                        Add
                      </Button>
                      {filteredSuggestions.length > 0 && skillInput.trim() && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-auto">
                          {filteredSuggestions.map((s) => (
                            <div
                              key={s.technical_skill}
                              className="px-4 py-2 cursor-pointer hover:bg-orange-50"
                              onClick={async () =>
                                await handleAddSkill(s.technical_skill)
                              }
                            >
                              {s.technical_skill}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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
