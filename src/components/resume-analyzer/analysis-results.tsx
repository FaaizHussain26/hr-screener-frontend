import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface AnalysisData {
  finalPercentage: number;
  personalInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  matchedSkills: string[];
  missingSkills: string[];
  relevantExperienceAndSkills: { score: number; rationale: string };
  educationAndCertifications: { score: number; rationale: string };
  professionalAchievementsAndImpact: { score: number; rationale: string };
  culturalFitAndSoftSkills: { score: number; rationale: string };
  keywordsAndATSOptimization: { score: number; rationale: string };
  resumeClarityAndProfessionalism: { score: number; rationale: string };
  overallFitForTheRole: { score: number; rationale: string };
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const categories = [
    {
      key: "relevantExperienceAndSkills" as const,
      label: "Experience & Skills",
    },
    {
      key: "educationAndCertifications" as const,
      label: "Education & Certifications",
    },
    {
      key: "professionalAchievementsAndImpact" as const,
      label: "Achievements & Impact",
    },
    {
      key: "culturalFitAndSoftSkills" as const,
      label: "Cultural Fit & Soft Skills",
    },
    { key: "keywordsAndATSOptimization" as const, label: "ATS Optimization" },
    {
      key: "resumeClarityAndProfessionalism" as const,
      label: "Clarity & Professionalism",
    },
    { key: "overallFitForTheRole" as const, label: "Overall Role Fit" },
  ];

  return (
    <div className="space-y-6">
      {/* Final Score */}
      <Card className="p-6 bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200 shadow-lg text-center">
        <div className="text-4xl font-bold text-orange-600">
          {data.finalPercentage}%
        </div>
        <p className="text-gray-600">Overall Match Score</p>
      </Card>

      {/* Personal Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Candidate Information</h3>
        <div className="space-y-1 text-sm text-gray-700">
          <p>
            <strong>Name:</strong> {data?.personalInfo?.name ?? "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {data?.personalInfo?.email ?? "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {data?.personalInfo?.phoneNumber ?? "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {data?.personalInfo?.address ?? "N/A"}
          </p>
        </div>
      </Card>

      {/* Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.matchedSkills.map((skill: string, idx: number) => (
              <Badge key={idx} variant="default">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-500">
            <XCircle className="w-5 h-5" />
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill: string, idx: number) => (
              <Badge key={idx} variant="destructive">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Category Scores */}
      <div className="grid gap-6">
        {categories.map((cat) => {
          const section = data[cat.key];
          return (
            <Card key={cat.key} className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{cat.label}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {section.score}/10
                  </span>
                  <Badge
                    variant={
                      section.score >= 8
                        ? "default"
                        : section.score >= 6
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {section.score >= 8
                      ? "Excellent"
                      : section.score >= 6
                      ? "Good"
                      : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
              <Progress value={(section.score / 10) * 100} className="mb-3" />
              <p className="text-sm text-gray-600">{section.rationale}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
