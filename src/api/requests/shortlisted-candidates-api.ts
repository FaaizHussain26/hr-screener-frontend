import axiosInstance from "../axiosInstance";

export interface QueryParams {
  search?: string;
  page?: number;
  limit?: number;
  isDeleted?: boolean;
  matchScoreMin?: number | null;
  matchScoreMax?: number | null;
  summaryMatched?: boolean | null;
  title?: string;
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
