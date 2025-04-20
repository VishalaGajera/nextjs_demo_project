"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { AUTH_ROUTES } from "../../../../constants/routes/auth/routes";
import { useAxios } from "../../../../hooks/useAxios";
import { authKeys } from "../../../../queryKeysFactories/auth";
import {
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "../../../../types/apiResponse";
import type { FormValuesTypes } from "../page";

type ForgotPasswordApiSuccessResponse = ApiSuccessResponse<
  Record<string, string>
>;

type UseForgotPasswordArgs = {
  options: UseMutationOptions<
    ForgotPasswordApiSuccessResponse,
    ApiErrorResponse<FormValuesTypes>,
    FormValuesTypes
  >;
};

export function useForgotPassword({ options = {} }: UseForgotPasswordArgs) {
  const { axios } = useAxios();

  return useMutation({
    mutationKey: authKeys.forgetPassword(),
    mutationFn: async (formValues) => {
      const { data } = await axios.post<ForgotPasswordApiSuccessResponse>(
        AUTH_ROUTES.forgetPassword,
        formValues
      );

      return data;
    },
    ...options,
  });
}
