"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { AUTH_ROUTES } from "../../../../constants/routes/auth/routes";
import { useAxios } from "../../../../hooks/useAxios";
import { authKeys } from "../../../../queryKeysFactories/auth";
import {
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "../../../../types/apiResponse";
import type { ResetPasswordPayload } from "../page";

type ResetPasswordApiSuccessResponse = ApiSuccessResponse<
  Record<string, string>
>;

type UseResetPasswordArgs = {
  token: string;
  options: UseMutationOptions<
    ResetPasswordApiSuccessResponse,
    ApiErrorResponse<ResetPasswordPayload>,
    ResetPasswordPayload
  >;
};

export function useResetPassword({
  options = {},
  token,
}: UseResetPasswordArgs) {
  const { axios } = useAxios();

  return useMutation({
    mutationKey: authKeys.resetPassword(),
    mutationFn: async (formValues) => {
      const { data } = await axios.post<ResetPasswordApiSuccessResponse>(
        AUTH_ROUTES.resetPassword,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    ...options,
  });
}
