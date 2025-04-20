import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { designationKeys } from "../../../../queryKeysFactories/designation";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { DESIGNATION_ROUTES } from "../../../../constants/routes/settings/designation/routes";

type UseGetDesignationArgs = {
  companyId?: string | null;
};

export function useGetDesignationOptionsQueryFn({
  companyId,
}: UseGetDesignationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDesignation = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      DESIGNATION_ROUTES.options(companyId)
    );

    return data.data;
  };

  return { fetchDesignation };
}
export function useGetDesignationOptions({ companyId }: UseGetDesignationArgs) {
  const { fetchDesignation } = useGetDesignationOptionsQueryFn({ companyId });

  return useQuery({
    queryKey: designationKeys.options(companyId),
    queryFn: fetchDesignation,
    enabled: !!companyId,
    initialData: [],
  });
}
