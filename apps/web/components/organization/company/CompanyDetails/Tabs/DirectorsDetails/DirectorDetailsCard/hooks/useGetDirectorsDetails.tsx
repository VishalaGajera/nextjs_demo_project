import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { directorDetailsKeys } from "../../../../../../../../queryKeysFactories/directorDetails";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import { DIRECTOR_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/director-details/routes";

export type DirectorDetails = {
  id: string;
  director_name: string;
  director_designation: string;
  director_address: string;
  director_photo: string;
  director_signature: string;
};

export function useGetDirectorsDetails({ companyId }: { companyId: string }) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDirectorsDetails = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<DirectorDetails[]>
    >(DIRECTOR_DETAILS_ROUTES.getAll(companyId));

    return data.data;
  };

  return useQuery({
    queryKey: directorDetailsKeys.listing(companyId),
    queryFn: fetchDirectorsDetails,
    enabled: !!companyId,
  });
}
