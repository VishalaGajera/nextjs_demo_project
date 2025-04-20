"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeEmergencyContact } from "../../../../../../../../../queryKeysFactories/employeeEmergencyContact";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import type { EmployeeEmergencyContact } from "../../hooks/useGetEmergencyContact";
import { EMPLOYEE_EMERGENCY_CONTACT_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/emergency-contact/routes";

export type Payload = {
  primary: Partial<{
    name: string | null;
    email: string | null;
    relation: string | null;
    mobile_no: string | null;
    address: string | null;
  }>;
  secondary: Partial<{
    name: string | null;
    email: string | null;
    relation: string | null;
    mobile_no: string | null;
    address: string | null;
  }>;
};

type UseEditEmergencyContactArgsApiResponse = ApiSuccessResponse<null>;

type UseEditEmergencyContactArgs = {
  options: UseMutationOptions<
    UseEditEmergencyContactArgsApiResponse,
    ApiErrorResponse<EmployeeEmergencyContact>,
    Payload
  >;
  employeeId: string;
};

export function useEditEmergencyContact({
  employeeId,
  options = {},
}: UseEditEmergencyContactArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeEmergencyContact.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<UseEditEmergencyContactArgsApiResponse>(
          EMPLOYEE_EMERGENCY_CONTACT_ROUTES.patch(employeeId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
