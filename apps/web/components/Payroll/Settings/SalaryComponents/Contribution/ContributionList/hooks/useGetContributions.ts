import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { CONTRIBUTION_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/contribution/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { contributionKeys } from "../../../../../../../queryKeysFactories/contribution";
import type { QuickFilter } from "../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type GetContributionsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetContributionsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getContributions = async ({ body }: GetContributionsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        contributionComponents: SalaryComponent[];
        totalCount: number;
      }>
    >(CONTRIBUTION_ROUTES.listing, body);

    return data.data;
  };

  return { getContributions };
}

export function useGetContributions({ body }: GetContributionsArgs) {
  const { getContributions } = useGetContributionsQueryFn();

  return useQuery({
    queryKey: contributionKeys.listing(body),
    queryFn: () => getContributions({ body }),
    initialData: { contributionComponents: [], totalCount: 0 },
  });
}
