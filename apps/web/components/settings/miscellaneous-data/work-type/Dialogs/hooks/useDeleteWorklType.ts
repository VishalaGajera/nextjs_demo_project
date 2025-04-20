"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { workTypeKeys } from "../../../../../../queryKeysFactories/worktype";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { WorkType } from "../../WorkTypeList/hooks/useGetWorkTypes";
import { WORK_TYPE_ROUTES } from "../../../../../../constants/routes/settings/work-type/routes";

type DeleteWorkTypeApiResponse = ApiSuccessResponse<WorkType>;

type UseDeleteWorkTypeArgs = {
  options: UseMutationOptions<DeleteWorkTypeApiResponse, ApiErrorResponse>;
  workTypeId: string;
};

export function useDeleteWorkType({
  workTypeId,
  options = {},
}: UseDeleteWorkTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: workTypeKeys.delete(workTypeId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteWorkTypeApiResponse>(
        WORK_TYPE_ROUTES.delete(workTypeId)
      );

      return data;
    },
    ...options,
  });
}
