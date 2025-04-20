"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeEducationKeys } from "../../../../../../../../../queryKeysFactories/employeeEducation";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import type { EducationDetails } from "../../EducationDetailList/hooks/useGetEducationDetails";
import type { EducationFormFieldValues } from "../EducationForm";
import { EMPLOYEE_EDUCATION_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/education-detail/routes";

type EditEducationApiResponse = ApiSuccessResponse<null>;

type UseEditEducationArgs = {
  options: UseMutationOptions<
    EditEducationApiResponse,
    ApiErrorResponse<EducationDetails>,
    Partial<EducationFormFieldValues>
  >;
  educationDetailId: string;
  employeeId: string;
};

export function useEditEducation({
  educationDetailId,
  options = {},
  employeeId,
}: UseEditEducationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeEducationKeys.edit(educationDetailId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditEducationApiResponse>(
        EMPLOYEE_EDUCATION_DETAILS_ROUTES.patch(employeeId, educationDetailId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
