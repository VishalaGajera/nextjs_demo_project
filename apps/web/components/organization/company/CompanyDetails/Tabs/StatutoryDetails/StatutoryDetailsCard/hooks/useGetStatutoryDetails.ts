import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { companyStatutoryKeys } from "../../../../../../../../queryKeysFactories/companyStatutory";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import { STATUTORY_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/statutory-details/routes";

export type StatutoryDetails = {
  cin_no: string;
  pan_no: string;
  tan_no: string;
  pf_no: string;
  esi_no: string;
  gst_no: string;
  pt_no: string;
  license_no: string;
  lwf_est_code: string;
  registered_date: string;
};

type UseGetStatutoryDetailsArgs = {
  companyId: string;
};

export function useGetStatutoryDetails({
  companyId,
}: UseGetStatutoryDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchCompanyStatutoryDetails = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<StatutoryDetails>
    >(STATUTORY_DETAILS_ROUTES.getAll(companyId));

    return data.data;
  };

  return useQuery({
    queryKey: companyStatutoryKeys.get(companyId),
    queryFn: fetchCompanyStatutoryDetails,
    enabled: !!companyId,
  });
}
