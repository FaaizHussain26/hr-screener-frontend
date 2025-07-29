const API_BASE_URL = "/api/v1";

export interface Job {
  _id: string;
  jobTitle: string;
  experience: string;
  summary: string;
  jobDescription: string;
  selectedSkills: string[];
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface JobsResponse {
  results: Job[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  success: boolean;
  message?: string;
}

export interface Skill {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface SkillsResponse {
  skills: Skill[];
  success: boolean;
  message?: string;
}

// Jobs API
export const jobsApi = {
  // GET /api/v1/jobs - Fetch all jobs
  getJobs: async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {}
  ): Promise<JobsResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);

    const response = await fetch(
      `${API_BASE_URL}/jobs?${searchParams.toString()}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }
    return response.json();
  },

  // GET /api/v1/jobs/{id} - Fetch specific job
  getJobById: async (
    id: string
  ): Promise<{ job: Job; success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch job: ${response.statusText}`);
    }
    return response.json();
  },

  // POST /api/v1/jobs - Create new job
  createJob: async (
    jobData: Omit<Job, "_id" | "createdAt" | "updatedAt">
  ): Promise<{ job: Job; success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create job: ${response.statusText}`);
    }
    return response.json();
  },

  // PUT /api/v1/jobs/{id} - Update job
  updateJob: async (
    id: string,
    jobData: Partial<Job>
  ): Promise<{ job: Job; success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update job: ${response.statusText}`);
    }
    return response.json();
  },

  // DELETE /api/v1/jobs - Delete job (soft delete)
  deleteJob: async (
    id: string
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete job: ${response.statusText}`);
    }
    return response.json();
  },

  // PUT /api/v1/jobs/restore/{id} - Restore deleted job
  restoreJob: async (
    id: string
  ): Promise<{ job: Job; success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/restore/${id}`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error(`Failed to restore job: ${response.statusText}`);
    }
    return response.json();
  },
};

// Skills API
export const skillsApi = {
  // GET /api/v1/jobs/skill - Fetch skills
  getSkills: async (search?: string): Promise<SkillsResponse> => {
    const searchParams = new URLSearchParams();
    if (search) searchParams.append("search", search);

    const response = await fetch(
      `${API_BASE_URL}/jobs/skill?${searchParams.toString()}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.statusText}`);
    }
    return response.json();
  },

  // POST /api/v1/jobs/skill - Create new skill (assuming this endpoint exists)
  createSkill: async (
    name: string
  ): Promise<{ skill: Skill; success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/skill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create skill: ${response.statusText}`);
    }
    return response.json();
  },
};
