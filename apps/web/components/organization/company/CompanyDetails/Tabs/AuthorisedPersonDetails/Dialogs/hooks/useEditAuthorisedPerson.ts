"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { authorisedPersonDetailsKey } from "../../../../../../../../queryKeysFactories/authorisedPersonDetails";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { AuthorisedPersonDetails } from "../../AuthorisedPersonDetailsCardList/hooks/useGetAuthorisedPersonDetailsCardList";
import type { AuthorisedPersonFormFieldValues } from "../AuthorisedPersonForm";
import { AUTHORISED_PERSON_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/authorised-person-details/routes";

type EditAuthorisedPersonApiResponse =
  ApiSuccessResponse<AuthorisedPersonDetails>;

type UseEditAuthorisedPersonArgs = {
  options: UseMutationOptions<
    EditAuthorisedPersonApiResponse,
    ApiErrorResponse<AuthorisedPersonFormFieldValues>,
    Partial<AuthorisedPersonFormFieldValues>
  >;
  personId: string;
  companyId: string;
};

export function useEditAuthorisedPerson({
  companyId,
  personId,
  options = {},
}: UseEditAuthorisedPersonArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: authorisedPersonDetailsKey.edit(personId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditAuthorisedPersonApiResponse>(
          AUTHORISED_PERSON_DETAILS_ROUTES.patch(companyId, personId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
