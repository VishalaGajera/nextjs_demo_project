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

type AddEducationApiSuccessResponse = ApiSuccessResponse<null>;

type UseAddEducationArgs = {
  options: UseMutationOptions<
    AddEducationApiSuccessResponse,
    ApiErrorResponse<EducationDetails>,
    Partial<EducationFormFieldValues>
  >;
  employeeId: string;
};

export type PayloadEducation = Partial<{
  qualification: string | null;
  institute: string | null;
  from_date: string | null;
  to_date: string | null;
  percentage_or_grade: string | null;
  qualification_area: string | null;
}>;
export function useAddEducation({
  options = {},
  employeeId,
}: UseAddEducationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeEducationKeys.add(employeeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddEducationApiSuccessResponse>(
        EMPLOYEE_EDUCATION_DETAILS_ROUTES.post(employeeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
