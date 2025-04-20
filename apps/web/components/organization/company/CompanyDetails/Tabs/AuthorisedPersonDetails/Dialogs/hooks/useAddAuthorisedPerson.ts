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

type AddAuthorisedPersonApiSuccessResponse =
  ApiSuccessResponse<AuthorisedPersonDetails>;

type UseAddAddAuthorisedPersonArgs = {
  options: UseMutationOptions<
    AddAuthorisedPersonApiSuccessResponse,
    ApiErrorResponse<AuthorisedPersonFormFieldValues>,
    Partial<AuthorisedPersonFormFieldValues>
  >;
  companyId: string;
};

export type PayloadAuthorisedPerson = Partial<{
  company_id: string | null;
  authorised_person_name: string | null;
  authorised_person_designation: string | null;
  authorised_person_address: string | null;
  authorised_person_photo: string | null;
  authorised_person_signature: string | null;
}>;

export function useAddAuthorisedPerson({
  companyId,
  options = {},
}: UseAddAddAuthorisedPersonArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: authorisedPersonDetailsKey.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddAuthorisedPersonApiSuccessResponse>(
          AUTHORISED_PERSON_DETAILS_ROUTES.post(companyId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
