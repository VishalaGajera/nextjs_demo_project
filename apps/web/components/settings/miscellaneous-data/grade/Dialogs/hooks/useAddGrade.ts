"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { gradeKeys } from "../../../../../../queryKeysFactories/grade";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { Grade } from "../../GradeList/hooks/useGetGrades";
import type { GradeFormFieldValues } from "../GradeForm";
import { GRADE_ROUTES } from "../../../../../../constants/routes/settings/grade/routes";

type AddGradeApiSuccessResponse = ApiSuccessResponse<Grade>;

type UseAddGradeArgs = {
  options: UseMutationOptions<
    AddGradeApiSuccessResponse,
    ApiErrorResponse<GradeFormFieldValues>,
    Partial<GradeFormFieldValues>
  >;
};

export function useAddGrade({ options = {} }: UseAddGradeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: gradeKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddGradeApiSuccessResponse>(
        GRADE_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
