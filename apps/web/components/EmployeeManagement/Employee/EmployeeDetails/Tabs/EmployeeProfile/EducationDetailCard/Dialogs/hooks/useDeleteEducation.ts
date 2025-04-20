"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeEducationKeys } from "../../../../../../../../../queryKeysFactories/employeeEducation";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import { EMPLOYEE_EDUCATION_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/education-detail/routes";

type DeleteEducationApiResponse = ApiSuccessResponse<null>;

type UseDeleteEducationArgs = {
  options: UseMutationOptions<DeleteEducationApiResponse, ApiErrorResponse>;
  educationId: string;
  employeeId: string;
};

export function useDeleteEducation({
  educationId,
  employeeId,
  options = {},
}: UseDeleteEducationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeEducationKeys.delete(educationId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteEducationApiResponse>(
        EMPLOYEE_EDUCATION_DETAILS_ROUTES.delete(employeeId, educationId)
      );

      return data;
    },
    ...options,
  });
}
