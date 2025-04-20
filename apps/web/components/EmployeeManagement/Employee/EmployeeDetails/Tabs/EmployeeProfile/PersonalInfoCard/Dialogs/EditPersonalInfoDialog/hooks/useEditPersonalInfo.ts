"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { employeePersonalInfo } from "../../../../../../../../../../queryKeysFactories/employeePersonalInfo";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../../types/apiResponse";
import type { PersonalInfoFormFieldValues } from "../PersonalInfoForm";
import { EMPLOYEE_PERSONAL_INFORMATION_ROUTES } from "../../../../../../../../../../constants/routes/employee-management/employee/personal-information/routes";

type EditPersonalInfoArgsApiResponse = ApiSuccessResponse<null>;

type UseEditPersonalInfoArgs = {
  options: UseMutationOptions<
    EditPersonalInfoArgsApiResponse,
    ApiErrorResponse<PersonalInfoFormFieldValues>,
    Partial<PersonalInfoFormFieldValues>
  >;
  employeeId: string;
};

export function useEditPersonalInfo({
  employeeId,
  options = {},
}: UseEditPersonalInfoArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeePersonalInfo.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditPersonalInfoArgsApiResponse>(
          EMPLOYEE_PERSONAL_INFORMATION_ROUTES.patch(employeeId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
