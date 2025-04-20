import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { BULK_ATTENDANCE_ROUTES } from "../../../../../../constants/routes/transactions/attendance/bulk-attendance/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bankShiftAllocationKeys } from "../../../../../../queryKeysFactories/bankShiftAllocation";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { BulkAttendanceType } from "../../BulkAttendanceList/hooks/useGetBulkAttendances";
import type { BulkAttendanceFormValues } from "../BulkAttendanceForm";

type EditBulkAttendanceApiSuccessResponse =
  ApiSuccessResponse<BulkAttendanceType>;

type UseEditBulkAttendanceArgs = {
  options: UseMutationOptions<
    EditBulkAttendanceApiSuccessResponse,
    ApiErrorResponse<BulkAttendanceFormValues>,
    Partial<BulkAttendanceFormValues>
  >;
  employeeIds: string[];
};

export function useEditBulkAttendance({
  employeeIds,
  options = {},
}: UseEditBulkAttendanceArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankShiftAllocationKeys.updateBankShift(employeeIds),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<EditBulkAttendanceApiSuccessResponse>(
          BULK_ATTENDANCE_ROUTES.post,
          { ...formValues, employee_ids: employeeIds }
        );

      return data;
    },
    ...options,
  });
}
