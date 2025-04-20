import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { industryKeys } from "../../../../../../queryKeysFactories/industry";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { Industry } from "../../IndustryList/hooks/useGetIndustries";
import { INDUSTRY_ROUTES } from "../../../../../../constants/routes/settings/industry/routes";

type UseGetIndustryArgs = {
  industryId: Industry["id"];
};

export function useGetIndustry({ industryId }: UseGetIndustryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchIndustry = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<Industry>>(
      INDUSTRY_ROUTES.get(industryId)
    );

    return data;
  };

  return useQuery({
    queryKey: industryKeys.get(industryId),
    queryFn: fetchIndustry,
    enabled: !!industryId,
  });
}
