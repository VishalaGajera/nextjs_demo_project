import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { EMPLOYEE_STATUTORY_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/finance/statutory-details/routes";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { statutoryKeys } from "../../../../../../../../../queryKeysFactories/statutory";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import type { StatutoryFormFieldValues } from "../../../../../../AddEmployee/EmployeeForm/StatutoryInfoForm";
import type { StatutoryInfo } from "./useGetStatutoryInfo";

type EditStatutoryInfoApiResponse = ApiSuccessResponse<StatutoryInfo>;

type UseEditBankInfoArgs = {
  options: UseMutationOptions<
    EditStatutoryInfoApiResponse,
    ApiErrorResponse<StatutoryFormFieldValues>,
    Partial<StatutoryFormFieldValues>
  >;
  employeeId: string;
};

export function useEditStatutoryInfo({
  employeeId,
  options = {},
}: UseEditBankInfoArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: statutoryKeys.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditStatutoryInfoApiResponse>(
        EMPLOYEE_STATUTORY_DETAILS_ROUTES.patch(employeeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
