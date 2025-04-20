"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { authorisedPersonDetailsKey } from "../../../../../../../../queryKeysFactories/authorisedPersonDetails";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { AuthorisedPersonDetails } from "../../AuthorisedPersonDetailsCardList/hooks/useGetAuthorisedPersonDetailsCardList";
import { AUTHORISED_PERSON_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/authorised-person-details/routes";

type DeleteAuthorisedPersonApiResponse =
  ApiSuccessResponse<AuthorisedPersonDetails>;

type UseDeleteAuthorisedPersonArgs = {
  options: UseMutationOptions<
    DeleteAuthorisedPersonApiResponse,
    ApiErrorResponse
  >;
  personId: string;
  companyId: string;
};

export function useDeleteAuthorisedPerson({
  companyId,
  personId,
  options = {},
}: UseDeleteAuthorisedPersonArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: authorisedPersonDetailsKey.delete(personId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteAuthorisedPersonApiResponse>(
          AUTHORISED_PERSON_DETAILS_ROUTES.delete(companyId, personId)
        );

      return data;
    },
    ...options,
  });
}
