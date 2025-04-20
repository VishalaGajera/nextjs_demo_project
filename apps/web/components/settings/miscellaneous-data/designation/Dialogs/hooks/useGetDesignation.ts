import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { designationKeys } from "../../../../../../queryKeysFactories/designation";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { Designation } from "../../DesignationList/hooks/useDesignations";
import { DESIGNATION_ROUTES } from "../../../../../../constants/routes/settings/designation/routes";

type UseGetDesignationArgs = {
  designationId: Designation["id"];
};

export function useGetDesignation({ designationId }: UseGetDesignationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDesignation = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<Designation>>(
      DESIGNATION_ROUTES.get(designationId)
    );

    return data;
  };

  return useQuery({
    queryKey: designationKeys.get(designationId),
    queryFn: fetchDesignation,
    enabled: !!designationId,
  });
}
