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

type AddWorkTypeApiSuccessResponse = ApiSuccessResponse<WorkType>;

type UseAddWorkTypeArgs = {
  options: UseMutationOptions<
    AddWorkTypeApiSuccessResponse,
    ApiErrorResponse<WorkTypeFormFieldValues>,
    Partial<WorkTypeFormFieldValues>
  >;
};

export function useAddWorkType({ options = {} }: UseAddWorkTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: workTypeKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddWorkTypeApiSuccessResponse>(
        WORK_TYPE_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
