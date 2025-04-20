import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { workTypeKeys } from "../../../../../../queryKeysFactories/worktype";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { WorkType } from "../../WorkTypeList/hooks/useGetWorkTypes";
import { WORK_TYPE_ROUTES } from "../../../../../../constants/routes/settings/work-type/routes";

type UseGetWorkTypeArgs = {
  workTypeId: WorkType["id"];
};

export function useGetWorkType({ workTypeId }: UseGetWorkTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchWorkType = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<WorkType>>(
      WORK_TYPE_ROUTES.get(workTypeId)
    );

    return data;
  };

  return useQuery({
    queryKey: workTypeKeys.get(workTypeId),
    queryFn: fetchWorkType,
    enabled: !!workTypeId,
  });
}
