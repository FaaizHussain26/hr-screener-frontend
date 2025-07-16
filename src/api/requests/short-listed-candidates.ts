import axiosInstance from "../axiosInstance";

export const getShortListedCandidates = async () => {
  const response = await axiosInstance.get("/shortlisted-candidates");
  return response.data;
};  