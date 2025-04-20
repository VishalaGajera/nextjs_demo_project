"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LWF_GROUP_ROUTES } from "../../../../../../../constants/routes/payroll/settings/contributions/lwf-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { labourWelfareFundKeys } from "../../../../../../../queryKeysFactories/labourWelfareFund";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { LabourWelfareFundFormValues } from "../../LabourWelfareFundForm/LabourWelfareFundForm";

type EditLabourWelfareFundApiResponse =
  ApiSuccessResponse<LabourWelfareFundFormValues>;

type UseEditLabourWelfareFundArgs = {
  options: UseMutationOptions<
    EditLabourWelfareFundApiResponse,
    ApiErrorResponse<LabourWelfareFundFormValues>,
    Partial<LabourWelfareFundFormValues>
  >;
  lwfGroupId: string;
};

export function useEditLabourWelfareFund({
  lwfGroupId,
  options = {},
}: UseEditLabourWelfareFundArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: labourWelfareFundKeys.edit(lwfGroupId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditLabourWelfareFundApiResponse>(
          LWF_GROUP_ROUTES.patch(lwfGroupId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
