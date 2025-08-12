import { ApplicantDetailModal } from "@/components/dashboard/applicant-datails-modal";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { useState } from "react";

interface Job {
  id: string;
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
        <header className="bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Open Jobs</h1>
              <p className="text-muted-foreground">
                Manage job postings and review applicants
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto ">
          <DashboardPage onJobSelect={handleJobSelect} />
        </main>
      </div>

      {/* Applicant Detail Modal */}
      <div>
        <ApplicantDetailModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Dashboard;
