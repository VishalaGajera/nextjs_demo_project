import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { BANK_SHIFT_ALLOCATION_ROUTES } from "../../../../../../constants/routes/bank-configurations/bank-shift-allocation/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bankShiftAllocationKeys } from "../../../../../../queryKeysFactories/bankShiftAllocation";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { BankShiftAllocationType } from "../../BankShiftAllocationList/Hooks/useGetBankShiftAllocation";
import type { BankShiftAllocationFormValues } from "../BankShiftAllocationForm";
type EditBankShiftAllocationApiSuccessResponse =
  ApiSuccessResponse<BankShiftAllocationType>;

type UseEditBankShiftAllocationArgs = {
  options: UseMutationOptions<
    EditBankShiftAllocationApiSuccessResponse,
    ApiErrorResponse<BankShiftAllocationFormValues>,
    Partial<BankShiftAllocationFormValues>
  >;
  employeeIds: string[];
};

export function useEditBankShiftAllocation({
  employeeIds,
  options = {},
}: UseEditBankShiftAllocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankShiftAllocationKeys.updateBankShift(employeeIds),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditBankShiftAllocationApiSuccessResponse>(
          BANK_SHIFT_ALLOCATION_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
