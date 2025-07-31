import axiosInstance from "../axiosInstance";

// Job Interfaces
export interface Job {
  _id: string;
  title: string;
  experience: string;
  summary: string;
  description: string;
  skills: string[];
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
  // GET /api/v1/jobs
  getJobs: async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {}
  ): Promise<JobsResponse> => {
    const { data } = await axiosInstance.get("/jobs", { params });
    return data.data;
  },

  // GET /api/v1/jobs/{id}
  getJobById: async (
    id: string
  ): Promise<{ job: Job; success: boolean; message?: string }> => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  },

  // POST /api/v1/jobs
  createJob: async (
    jobData: Omit<Job, "_id" | "createdAt" | "updatedAt">
  ): Promise<{ job: Job; success: boolean; message?: string }> => {
    const response = await axiosInstance.post("/jobs", jobData);
    return response.data;
  },

  // PUT /api/v1/jobs/{id}
  updateJob: async (
    id: string,
    jobData: Partial<Job>
  ): Promise<{ job: Job; success: boolean; message?: string }> => {
    const response = await axiosInstance.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // DELETE /api/v1/jobs
  deleteJob: async (
    id: string
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await axiosInstance.delete(
      `/jobs?id=${id}&deleteOption=softDelete`
      // {
      //   data: { id },
      // }
    );
    return response.data;
  },

  // PUT /api/v1/jobs/restore/{id}
  restoreJob: async (
    id: string
  ): Promise<{ job: Job; success: boolean; message?: string }> => {
    const response = await axiosInstance.put(`/jobs/restore/${id}`);
    return response.data;
  },
};

// Skills API
export const skillsApi = {
  // GET /api/v1/jobs/skill
  getSkills: async (search?: string): Promise<SkillsResponse> => {
    const response = await axiosInstance.get("/skills", {
      params: { search },
    });
    console.log(response);
    return response.data;
  },

  // POST /api/v1/jobs/skill
  createSkill: async (
    technical_skill: string
  ): Promise<{ skill: Skill; success: boolean; message?: string }> => {
    const response = await axiosInstance.post("/skills", { technical_skill });
    return response.data;
  },
};
