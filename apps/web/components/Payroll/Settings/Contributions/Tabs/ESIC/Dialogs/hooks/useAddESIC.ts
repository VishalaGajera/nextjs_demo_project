"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { ESIC_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/esic/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { esicKeys } from "../../../../../../../../queryKeysFactories/esic";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { ESICRecord } from "../../ESICList/hooks/useGetESICList";
import type { ESICFormFieldValues } from "../ESICForm";

type AddESICApiSuccessResponse = ApiSuccessResponse<ESICRecord>;

type UseAddESICArgs = {
  options: UseMutationOptions<
    AddESICApiSuccessResponse,
    ApiErrorResponse<ESICFormFieldValues>,
    Partial<ESICFormFieldValues>
  >;
};

export function useAddESIC({ options = {} }: UseAddESICArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: esicKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddESICApiSuccessResponse>(
        ESIC_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
