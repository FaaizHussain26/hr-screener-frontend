"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Clock,
  FileText,
  Calendar,
  Hash,
  Edit,
  Share,
  Save,
  X,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateJob } from "@/api/hooks/job-module/useJobs";
import type { Job } from "@/api/requests/job-module-api";
import SkillManager from "./skill-manager";

interface ViewJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onEditJob?: (job: Job) => void;
  onShareJob?: (job: Job) => void;
}

interface JobFormData {
  title: string;
  experience: string;
  summary: string;
  description: string;
  skills: string[];
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <span className="font-medium text-sm min-w-0">{label}:</span>
      <span className="text-sm truncate">{value}</span>
    </div>
  );
}

function EditableInfoRow({
  icon: Icon,
  label,
  value,
  onChange,
  name,
  type = "text",
  placeholder,
}: {
  icon: any;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={name}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <Icon className="w-4 h-4 text-muted-foreground" />
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}

function EditableTextareaRow({
  icon: Icon,
  label,
  value,
  onChange,
  name,
  placeholder,
  rows = 3,
}: {
  icon: any;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={name}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <Icon className="w-4 h-4 text-muted-foreground" />
        {label}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none"
      />
    </div>
  );
}

function BasicInfoCard({
  job,
  isEditing,
  formData,
  onFormChange,
}: {
  job: Job;
  isEditing: boolean;
  formData: JobFormData;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="h-fit m-5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Briefcase className="w-5 h-5" />
          Job Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <EditableInfoRow
              icon={Briefcase}
              label="Job Title"
              value={formData.title}
              onChange={onFormChange}
              name="title"
              placeholder="Enter job title"
            />
            <EditableInfoRow
              icon={Clock}
              label="Experience Required"
              value={formData.experience}
              onChange={onFormChange}
              name="experience"
              placeholder="e.g., 2-3 years, Entry Level, Senior"
            />
            <EditableTextareaRow
              icon={FileText}
              label="Summary"
              value={formData.summary}
              onChange={onFormChange}
              name="summary"
              placeholder="Brief job summary..."
              rows={3}
            />
          </>
        ) : (
          <div className="space-y-2">
            <InfoRow icon={Briefcase} label="Job Title" value={job.title} />
            <InfoRow
              icon={Clock}
              label="Experience Required"
              value={job.experience}
            />
            {job.createdAt && (
              <InfoRow
                icon={Calendar}
                label="Created Date"
                value={formatDate(job.createdAt)}
              />
            )}
            {job.updatedAt && (
              <InfoRow
                icon={Calendar}
                label="Last Updated"
                value={formatDate(job.updatedAt)}
              />
            )}
            {job.summary && (
              <>
                <Separator className="my-4" />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Summary:</span>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                    <p className="text-sm leading-relaxed">{job.summary}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SkillsCard({
  skills,
  isEditing,
  formData,
  onSkillsChange,
}: {
  skills: string[];
  isEditing: boolean;
  formData: JobFormData;
  onSkillsChange: (skills: string[]) => void;
}) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      onSkillsChange([...formData.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(formData.skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  if (!isEditing && (!skills || skills.length === 0)) return null;

  console.log(skills, "skills");

  return (
    <Card className="h-fit m-5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Hash className="w-5 h-5" />
          Required Skills ({isEditing ? formData.skills.length : skills.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a skill..."
                className="flex-1"
              />
              <Button onClick={addSkill} size="sm" disabled={!newSkill.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="hover:bg-secondary/80 transition-colors group cursor-pointer"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="hover:bg-secondary/80 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DataCard({
  title,
  icon: Icon,
  data,
  isEditing,
  formData,
  onFormChange,
  fieldName,
}: {
  title: string;
  icon: any;
  data: string | null;
  isEditing: boolean;
  formData: JobFormData;
  onFormChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  fieldName: keyof JobFormData;
}) {
  if (!isEditing && !data) return null;

  return (
    <Card className="h-fit m-5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              name={fieldName}
              value={formData[fieldName] as string}
              onChange={onFormChange}
              placeholder={`Enter ${title.toLowerCase()}...`}
              rows={8}
              className="w-full resize-none font-mono text-sm"
            />
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg border">
            <ScrollArea className="h-64 p-4">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {data}
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ViewJobModal({
  open,
  onOpenChange,
  job,
  onEditJob,
  onShareJob,
}: ViewJobModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    experience: "",
    summary: "",
    description: "",
    skills: [],
  });

  // Use the update job mutation
  const updateJobMutation = useUpdateJob();

  // Initialize form data when job changes
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        experience: job.experience || "",
        summary: job.summary || "",
        description: job.description || "",
        skills: job.skills || [],
      });
    }
  }, [job]);

  // Reset editing state when modal closes
  useEffect(() => {
    if (!open) {
      setIsEditing(false);
    }
  }, [open]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSave = async () => {
    if (!job) return;

    try {
      await updateJobMutation.mutateAsync({
        id: job._id,
        data: formData,
      });

      setIsEditing(false);

      // Call onEditJob callback if provided
      if (onEditJob) {
        onEditJob({ ...job, ...formData });
      }
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Error updating job:", error);
    }
  };

  const handleCancel = () => {
    if (job) {
      setFormData({
        title: job.title || "",
        experience: job.experience || "",
        summary: job.summary || "",
        description: job.description || "",
        skills: job.skills || [],
      });
    }
    setIsEditing(false);
  };

  if (!job) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl lg:max-w-xl xl:max-w-2xl overflow-hidden">
        <SheetHeader className="space-y-3 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="w-6 h-6" />
            {isEditing ? "Edit Job" : job.title}
          </SheetTitle>
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {!isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Job
                </Button>
                {onShareJob && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onShareJob(job)}
                    className="flex items-center gap-2"
                  >
                    <Share className="w-4 h-4" />
                    Share Job
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={async () => {
                    await handleSave();
                    onOpenChange(false);
                  }}
                  disabled={updateJobMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updateJobMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateJobMutation.isPending}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <BasicInfoCard
            job={job}
            isEditing={isEditing}
            formData={formData}
            onFormChange={handleFormChange}
          />

          <div className="grid grid-cols-1 gap-6">
            <SkillsCard
              skills={job.skills}
              isEditing={isEditing}
              formData={formData}
              onSkillsChange={handleSkillsChange}
            />
          </div>

          <DataCard
            title="Job Description"
            icon={FileText}
            data={job.description}
            isEditing={isEditing}
            formData={formData}
            onFormChange={handleFormChange}
            fieldName="description"
          />
        </ScrollArea>

        <SheetFooter className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateJobMutation.isPending}
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
