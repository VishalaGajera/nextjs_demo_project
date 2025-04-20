import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { workTypeKeys } from "../../../../queryKeysFactories/worktype";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { WORK_TYPE_ROUTES } from "../../../../constants/routes/settings/work-type/routes";

type UseGetWorkTypeArgs = {
  companyId: string;
};

export function useGetWorkTypeOptions({ companyId }: UseGetWorkTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchWorkType = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      WORK_TYPE_ROUTES.options(companyId)
    );

    return data?.data;
  };

  return useQuery({
    queryKey: workTypeKeys.options(companyId),
    queryFn: fetchWorkType,
    enabled: !!companyId,
    initialData: [],
  });
}
