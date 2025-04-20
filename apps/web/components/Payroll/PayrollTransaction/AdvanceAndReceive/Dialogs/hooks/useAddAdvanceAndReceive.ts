"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { ADVANCE_AND_RECEIVE_ROUTES } from "../../../../../../constants/routes/payroll/payroll-transaction/advance-receive/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { advanceReceiveKeys } from "../../../../../../queryKeysFactories/advanceReceive";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { AdvanceAndReceiveFormFieldValues } from "../AddAdvanceAndReceiveForm";

type AddProvidentFundApiSuccessResponse = ApiSuccessResponse<null>;

type UseAddAdvanceAndReceiveArgs = {
  options: UseMutationOptions<
    AddProvidentFundApiSuccessResponse,
    ApiErrorResponse<AdvanceAndReceiveFormFieldValues>,
    Partial<AdvanceAndReceiveFormFieldValues>
  >;
};

export function useAddAdvanceAndReceive({
  options = {},
}: UseAddAdvanceAndReceiveArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: advanceReceiveKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddProvidentFundApiSuccessResponse>(
          ADVANCE_AND_RECEIVE_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
