"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { pastWorkEmploymentKeys } from "../../../../../../../../../queryKeysFactories/pastWorkEmployment";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";

import type { PastWorkEmployment } from "../../PastWorkEmploymentList/hooks/useGetPastWorkEmployments";
import type { PastWorkEmploymentSchemaFormFieldValues } from "../PastWorkEmploymentForm";
import { EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/past-work-employment/routes";
type AddPastWorkEmploymentApiSuccessResponse =
  ApiSuccessResponse<PastWorkEmployment>;

type UseAddPastWorkEmploymentArgs = {
  options: UseMutationOptions<
    AddPastWorkEmploymentApiSuccessResponse,
    ApiErrorResponse<PastWorkEmploymentSchemaFormFieldValues>,
    Partial<PastWorkEmploymentSchemaFormFieldValues>
  >;
  employeeId: string;
};

export type PayloadPastWorkEmployment = Partial<{
  company_name: string | null;
  from_date: string | null;
  to_date: string | null;
  designation: string | null;
  address: string | null;
  leaving_reason: string | null;
}>;

export function useAddPastWorkEmployment({
  options = {},
  employeeId,
}: UseAddPastWorkEmploymentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: pastWorkEmploymentKeys.add(employeeId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddPastWorkEmploymentApiSuccessResponse>(
          EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES.post(employeeId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
