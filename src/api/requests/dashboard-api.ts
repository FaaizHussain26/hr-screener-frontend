import axiosInstance from "../axiosInstance";

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/shortlisted-candidate/dashboard/stats");
  return response.data;
};
