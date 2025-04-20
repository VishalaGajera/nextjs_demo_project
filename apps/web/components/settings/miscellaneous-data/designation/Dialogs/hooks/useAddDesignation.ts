"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { designationKeys } from "../../../../../../queryKeysFactories/designation";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { Designation } from "../../DesignationList/hooks/useDesignations";
import type { DesignationFormFieldValues } from "../DesignationForm";
import { DESIGNATION_ROUTES } from "../../../../../../constants/routes/settings/designation/routes";

type AddDesignationApiSuccessResponse = ApiSuccessResponse<Designation>;

type UseAddDesignationArgs = {
  options: UseMutationOptions<
    AddDesignationApiSuccessResponse,
    ApiErrorResponse<DesignationFormFieldValues>,
    Partial<DesignationFormFieldValues>
  >;
};

export function useAddDesignation({ options = {} }: UseAddDesignationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: designationKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddDesignationApiSuccessResponse>(
          DESIGNATION_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
