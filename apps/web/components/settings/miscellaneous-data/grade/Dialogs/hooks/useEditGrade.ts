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

type EditGradeApiResponse = ApiSuccessResponse<Grade>;

type UseEditGradeArgs = {
  options: UseMutationOptions<
    EditGradeApiResponse,
    ApiErrorResponse<GradeFormFieldValues>,
    Partial<GradeFormFieldValues>
  >;
  gradeId: string;
};

export function useEditGrade({ gradeId, options = {} }: UseEditGradeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: gradeKeys.edit(gradeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditGradeApiResponse>(
        GRADE_ROUTES.patch(gradeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
