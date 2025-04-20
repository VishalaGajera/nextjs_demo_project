import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { EMPLOYEE_FINANCE_ROUTES } from "../../../../../../../../../../constants/routes/payroll/employee-finance/routes";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { salarySetupkeys } from "../../../../../../../../../../queryKeysFactories/salarySetup";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../../types/apiResponse";
import type { SalarySetupSchemaType } from "../AddSalarySetupForm";

export type AddSalarySetupApiSuccessResponse = ApiSuccessResponse<null>;

export type AddSalarySetupApiPayload = Omit<
  SalarySetupSchemaType,
  "custom_structure_name" | "structure_by" | "structure_type"
>;

type UseAddSalarySetupArgs = {
  options: UseMutationOptions<
    AddSalarySetupApiSuccessResponse,
    ApiErrorResponse<AddSalarySetupApiPayload>,
    Partial<AddSalarySetupApiPayload>
  >;
  employeeId: string;
};

export function useAddSalarySetup({
  options = {},
  employeeId,
}: UseAddSalarySetupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salarySetupkeys.post(employeeId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddSalarySetupApiSuccessResponse>(
          EMPLOYEE_FINANCE_ROUTES.post(employeeId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
