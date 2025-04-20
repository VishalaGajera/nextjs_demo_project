import { useQuery } from "@tanstack/react-query";

import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { directorDetailsKeys } from "../../../../../../../../queryKeysFactories/directorDetails";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { DirectorDetails } from "../../DirectorDetailsCard/hooks/useGetDirectorsDetails";
import { DIRECTOR_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/director-details/routes";

type UseGetDirectorDetailArgs = {
  directorDetailId: DirectorDetails["id"];
  companyId: string;
};

export function useGetDirectorDetail({
  directorDetailId,
  companyId,
}: UseGetDirectorDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDirectorDetail = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<DirectorDetails>>(
      DIRECTOR_DETAILS_ROUTES.get(companyId, directorDetailId)
    );

    return data;
  };

  return useQuery({
    queryKey: directorDetailsKeys.get(directorDetailId),
    queryFn: fetchDirectorDetail,
    enabled: !!directorDetailId,
  });
}
