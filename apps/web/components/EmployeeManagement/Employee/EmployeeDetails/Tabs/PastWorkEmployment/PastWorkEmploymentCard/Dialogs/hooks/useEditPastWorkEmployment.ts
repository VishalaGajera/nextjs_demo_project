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

type EditPastWorkEmploymentApiResponse = ApiSuccessResponse<PastWorkEmployment>;

type UseEditPastWorkEmploymentArgs = {
  options: UseMutationOptions<
    EditPastWorkEmploymentApiResponse,
    ApiErrorResponse<PastWorkEmploymentSchemaFormFieldValues>,
    Partial<PastWorkEmploymentSchemaFormFieldValues>
  >;
  pastWorkEmploymentId: string;
  employeeId: string;
};

export function useEditPastWorkEmployment({
  employeeId,
  pastWorkEmploymentId,
  options = {},
}: UseEditPastWorkEmploymentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: pastWorkEmploymentKeys.edit(pastWorkEmploymentId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditPastWorkEmploymentApiResponse>(
          EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES.patch(
            employeeId,
            pastWorkEmploymentId
          ),
          formValues
        );

      return data;
    },
    ...options,
  });
}
