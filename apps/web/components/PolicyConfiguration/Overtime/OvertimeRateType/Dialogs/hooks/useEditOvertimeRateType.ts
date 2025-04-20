"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { overtimeRateTypeKeys } from "../../../../../../queryKeysFactories/overtimeRateType";
import type { OvertimeRateType } from "../../OvertimeRateTypeList/hooks/useGetOvertimeRateTypes";
import type { OvertimeRateTypeFormFieldValues } from "../OvertimeRateTypeForm";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { OVERTIME_RATE_TYPE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rate-type/routes";

type EditOvertimeRateTypeApiResponse = ApiSuccessResponse<OvertimeRateType>;

type UseEditOvertimeRateTypeArgs = {
  options: UseMutationOptions<
    EditOvertimeRateTypeApiResponse,
    ApiErrorResponse<OvertimeRateTypeFormFieldValues>,
    Partial<OvertimeRateTypeFormFieldValues>
  >;
  overtimeRateTypeId: string;
};

export function useEditOvertimeRateType({
  overtimeRateTypeId,
  options = {},
}: UseEditOvertimeRateTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: overtimeRateTypeKeys.edit(overtimeRateTypeId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditOvertimeRateTypeApiResponse>(
          OVERTIME_RATE_TYPE_ROUTES.patch(overtimeRateTypeId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
