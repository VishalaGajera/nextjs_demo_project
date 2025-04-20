import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { authorisedPersonDetailsKey } from "../../../../../../../../queryKeysFactories/authorisedPersonDetails";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { AuthorisedPersonDetails } from "../../AuthorisedPersonDetailsCardList/hooks/useGetAuthorisedPersonDetailsCardList";
import { AUTHORISED_PERSON_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/authorised-person-details/routes";

type UseGetAuthorisedPersonArgs = {
  personId: AuthorisedPersonDetails["id"];
  companyId: string;
};

export function useGetAuthorisedPerson({
  personId,
  companyId,
}: UseGetAuthorisedPersonArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEducationDetail = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<AuthorisedPersonDetails>>(
      AUTHORISED_PERSON_DETAILS_ROUTES.get(companyId, personId)
    );

    return data;
  };

  return useQuery({
    queryKey: authorisedPersonDetailsKey.get(personId),
    queryFn: fetchEducationDetail,
    enabled: !!personId && !!companyId,
  });
}
