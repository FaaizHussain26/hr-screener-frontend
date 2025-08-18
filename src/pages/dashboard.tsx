import { ApplicantDetailModal } from "@/components/dashboard/applicant-datails-modal";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { useState } from "react";

export interface Job {
  id: string;
  _id: string;
  count: number;
  title: string;
  jobId: string;
  totalApplicants: number;
  strongMatch: number;
  potentialMatch: number;
  irrelevant: number;
  department: string;
  location: string;
  datePosted: string;
}

const Dashboard = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto ">
          <DashboardPage onJobSelect={handleJobSelect} />
        </main>
      </div>

      {/* Applicant Detail Modal */}
      <div>
        <ApplicantDetailModal
          job={selectedJob as any}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Dashboard;
