import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog-applicant-detail-model";
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
} from "../ui/form";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { debounce } from "lodash";

// -------------------- Mock APIs --------------------
const getSkills = async (query: string): Promise<string[]> => {
  const response = await fetch(`/api/skills?search=${query}`);
  const data = await response.json();
  return data.skills;
};

const addSkill = async (name: string): Promise<string> => {
  const response = await fetch("/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  return data.skill; // Return skill name
};
// ----------------------------------------------------

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

  const [isSaving, setIsSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const selectedSkills = form.watch("selectedSkills");

  // Debounced search
  const debouncedFetchSkills = debounce(async (query: string) => {
    try {
      if (query.length > 0) {
        const skills = await getSkills(query);
        setSuggestedSkills(skills.filter((s) => !selectedSkills.includes(s)));
      } else {
        setSuggestedSkills([]);
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  }, 300);

  useEffect(() => {
    debouncedFetchSkills(skillInput);
    return () => debouncedFetchSkills.cancel();
  }, [skillInput]);

  const handleAddSkill = async (value?: string) => {
    const skill = (value || skillInput).trim();
    if (!skill) return;

    if (selectedSkills.includes(skill)) {
      toast.warning("Skill already added");
      return;
    }

    if (!suggestedSkills.includes(skill)) {
      try {
        await addSkill(skill); // save to backend
      } catch {
        toast.error("Failed to add skill");
        return;
      }
    }

    form.setValue("selectedSkills", [...selectedSkills, skill], {
      shouldValidate: true,
    });
    setSkillInput("");
    setSuggestedSkills([]);
  };

  const handleRemoveSkill = (skill: string) => {
    form.setValue(
      "selectedSkills",
      selectedSkills.filter((s) => s !== skill),
      { shouldValidate: true }
    );
  };

  const onSubmit = async () => {
    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // replace with actual submit
      toast.success("Job added successfully");
      form.reset();
      onClose();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

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
                      disabled={!skillInput.trim()}
                    >
                      Add
                    </Button>
                  </div>

                  {suggestedSkills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {suggestedSkills.map((skill) => (
                        <Badge
                          key={skill}
                          onClick={() => handleAddSkill(skill)}
                          className="cursor-pointer bg-muted hover:bg-muted/80"
                        >
                          + {skill}
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

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-card-box hover:bg-black text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full mr-2 border-b-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Job
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
