"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { overtimeRateTypeKeys } from "../../../../../../queryKeysFactories/overtimeRateType";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { OvertimeRateType } from "../../OvertimeRateTypeList/hooks/useGetOvertimeRateTypes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { OVERTIME_RATE_TYPE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rate-type/routes";

type DeleteOvertimeRateTypeApiResponse = ApiSuccessResponse<OvertimeRateType>;

type UseDeleteOvertimeRateTypeArgs = {
  options: UseMutationOptions<
    DeleteOvertimeRateTypeApiResponse,
    ApiErrorResponse
  >;
  overtimeRateTypeId: string;
};

export function useDeleteOvertimeRateType({
  overtimeRateTypeId,
  options = {},
}: UseDeleteOvertimeRateTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: overtimeRateTypeKeys.delete(overtimeRateTypeId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteOvertimeRateTypeApiResponse>(
          OVERTIME_RATE_TYPE_ROUTES.delete(overtimeRateTypeId)
        );

      return data;
    },
    ...options,
  });
}
