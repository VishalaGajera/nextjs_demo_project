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

type EditDesignationApiResponse = ApiSuccessResponse<Designation>;

type UseEditDesignationArgs = {
  options: UseMutationOptions<
    EditDesignationApiResponse,
    ApiErrorResponse<DesignationFormFieldValues>,
    Partial<DesignationFormFieldValues>
  >;
  designationId: string;
};

export function useEditDesignation({
  designationId,
  options = {},
}: UseEditDesignationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: designationKeys.edit(designationId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditDesignationApiResponse>(
        DESIGNATION_ROUTES.patch(designationId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
