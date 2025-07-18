import axiosInstance from "../axiosInstance";

export interface QueryParams {
  page?: number;
  search?: string;
  limit?: number;
}

export const getShortListedCandidates = async (params: QueryParams) => {
  const response = await axiosInstance.get("/shortlisted-candidates", {
    params,
  });
  return response.data;
};

export const deleteShortListedCandidate = async (itemId: string) => {
  const response = await axiosInstance.delete(
    `/shortlisted-candidates/?id=${itemId}&deleteOption=softDelete`
  );
  return response.data;
};
