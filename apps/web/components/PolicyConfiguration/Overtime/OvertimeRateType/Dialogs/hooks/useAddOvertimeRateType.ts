"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { overtimeRateTypeKeys } from "../../../../../../queryKeysFactories/overtimeRateType";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type { OvertimeRateType } from "../../OvertimeRateTypeList/hooks/useGetOvertimeRateTypes";
import type { OvertimeRateTypeFormFieldValues } from "../OvertimeRateTypeForm";
import { OVERTIME_RATE_TYPE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rate-type/routes";

type AddOvertimeRateTypeApiSuccessResponse =
  ApiSuccessResponse<OvertimeRateType>;

type UseAddOvertimeRateTypeArgs = {
  options: UseMutationOptions<
    AddOvertimeRateTypeApiSuccessResponse,
    ApiErrorResponse<OvertimeRateTypeFormFieldValues>,
    Partial<OvertimeRateTypeFormFieldValues>
  >;
};

export function useAddOvertimeRateType({
  options = {},
}: UseAddOvertimeRateTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: overtimeRateTypeKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddOvertimeRateTypeApiSuccessResponse>(
          OVERTIME_RATE_TYPE_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
