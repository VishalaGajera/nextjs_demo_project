"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EMPLOYEE_REFERENCE_DETAIL_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/reference-detail/routes";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeReferenceDetails } from "../../../../../../../../../queryKeysFactories/employeeReferenceDetails";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import { type ReferenceDetailsFormFieldValues } from "../../ReferenceDetailsForm";

type EditReferenceDetailsApiResponse = ApiSuccessResponse<null>;

type UseEditReferenceDetailsArgs = {
  options: UseMutationOptions<
    EditReferenceDetailsApiResponse,
    ApiErrorResponse<ReferenceDetailsFormFieldValues>,
    Partial<ReferenceDetailsFormFieldValues>
  >;
  employeeId: string;
};

export function useEditReferenceDetails({
  employeeId,
  options = {},
}: UseEditReferenceDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeReferenceDetails.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditReferenceDetailsApiResponse>(
          EMPLOYEE_REFERENCE_DETAIL_ROUTES.patch(employeeId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
