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
import type { WorkTypeFormFieldValues } from "../WorkTypeForm";
import { WORK_TYPE_ROUTES } from "../../../../../../constants/routes/settings/work-type/routes";

type EditWorkTypeApiResponse = ApiSuccessResponse<WorkType>;

type UseEditWorkTypeArgs = {
  options: UseMutationOptions<
    EditWorkTypeApiResponse,
    ApiErrorResponse<WorkTypeFormFieldValues>,
    Partial<WorkTypeFormFieldValues>
  >;
  workTypeId: string;
};

export function useEditWorkType({
  workTypeId,
  options = {},
}: UseEditWorkTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: workTypeKeys.edit(workTypeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditWorkTypeApiResponse>(
        WORK_TYPE_ROUTES.patch(workTypeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
