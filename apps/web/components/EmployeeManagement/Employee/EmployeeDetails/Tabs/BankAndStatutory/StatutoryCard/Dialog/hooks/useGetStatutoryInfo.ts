import { useQuery } from "@tanstack/react-query";
import { EMPLOYEE_STATUTORY_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/finance/statutory-details/routes";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { statutoryKeys } from "../../../../../../../../../queryKeysFactories/statutory";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";

export type StatutoryInfo = {
  pf_applicable: boolean;
  epf_group_id: string;
  epf_group_name: string;
  pf_account_no: string;
  pf_joining_date: string;
  uan_no: string;
  esic_applicable: boolean;
  esic_group_id: string;
  esic_group_name: string;
  esic_no: string;
  esic_joining_date: string;
  pt_applicable: boolean;
  lwf_applicable: boolean;
  tds_applicable: boolean;
  tax_section_id: string;
  tax_regime_name: string;
  tax_regime_id: string;
};

type UseGetStatutoryInfoArgs = {
  employeeId: string;
};

export function useGetStatutoryInfo({ employeeId }: UseGetStatutoryInfoArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchStatutoryInformation = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<StatutoryInfo>>(
      EMPLOYEE_STATUTORY_DETAILS_ROUTES.get(employeeId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: statutoryKeys.get(employeeId),
    queryFn: fetchStatutoryInformation,
    enabled: !!employeeId,
  });
}
