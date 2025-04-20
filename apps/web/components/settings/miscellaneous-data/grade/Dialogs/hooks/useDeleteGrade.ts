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
import { GRADE_ROUTES } from "../../../../../../constants/routes/settings/grade/routes";

type DeleteGradeApiResponse = ApiSuccessResponse<Grade>;

type UseDeleteGradeArgs = {
  options: UseMutationOptions<DeleteGradeApiResponse, ApiErrorResponse>;
  gradeId: string;
};

export function useDeleteGrade({ gradeId, options = {} }: UseDeleteGradeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: gradeKeys.delete(gradeId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteGradeApiResponse>(
        GRADE_ROUTES.delete(gradeId)
      );

      return data;
    },
    ...options,
  });
}
