import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { authorisedPersonDetailsKey } from "../../../../../../../../queryKeysFactories/authorisedPersonDetails";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import { AUTHORISED_PERSON_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/authorised-person-details/routes";

export type AuthorisedPersonDetails = {
  id: string;
  authorised_person_name: string;
  authorised_person_designation: string;
  authorised_person_address: string;
  authorised_person_photo: string;
  authorised_person_signature: string;
};

type companyId = {
  companyId: string;
};

export function useGetAuthorisedPersonDetailsList({ companyId }: companyId) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchAuthorisedPersonDetailsList = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<AuthorisedPersonDetails[]>
    >(AUTHORISED_PERSON_DETAILS_ROUTES.getAll(companyId));

    return data.data;
  };

  return useQuery({
    queryKey: authorisedPersonDetailsKey.listing(companyId),
    queryFn: fetchAuthorisedPersonDetailsList,
    enabled: !!companyId,
  });
}
