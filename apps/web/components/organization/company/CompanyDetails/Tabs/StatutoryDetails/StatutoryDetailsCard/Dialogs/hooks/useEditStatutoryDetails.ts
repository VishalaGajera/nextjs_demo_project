"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { companyStatutoryKeys } from "../../../../../../../../../queryKeysFactories/companyStatutory";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import type { StatutoryDetails } from "../../hooks/useGetStatutoryDetails";
import type { StatutoryDetailsFormFieldValues } from "../StatutoryDetailsForm";
import { STATUTORY_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/organization/company/statutory-details/routes";

type EditStatutoryDetailsArgsApiResponse = ApiSuccessResponse<StatutoryDetails>;

type EditStatutoryDetailsArgs = {
  options: UseMutationOptions<
    EditStatutoryDetailsArgsApiResponse,
    ApiErrorResponse<StatutoryDetailsFormFieldValues>,
    Partial<StatutoryDetailsFormFieldValues>
  >;
  companyId: string;
};

export function useEditStatutoryDetails({
  companyId,
  options = {},
}: EditStatutoryDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: companyStatutoryKeys.edit(companyId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditStatutoryDetailsArgsApiResponse>(
          STATUTORY_DETAILS_ROUTES.patch(companyId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
