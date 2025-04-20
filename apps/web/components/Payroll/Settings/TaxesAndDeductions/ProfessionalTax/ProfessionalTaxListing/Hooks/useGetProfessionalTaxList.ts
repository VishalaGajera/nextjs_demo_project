import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { PT_GROUP_ROUTES } from "../../../../../../../constants/routes/payroll/settings/taxes-deductions/pt-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { professionalTaxesKeys } from "../../../../../../../queryKeysFactories/professionalTaxes";
import { type QuickFilter } from "../../../../../../../types/agGrid";
import { type ApiSuccessResponse } from "../../../../../../../types/apiResponse";

export type PtGroupType = {
  id: string;
  state_name: string;
  deduction_cycle_type: "half_yearly" | "monthly" | "quarterly" | "yearly";
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetProfessionalTaxListProps = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetProfessionalTaxListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getProfessionalTaxList = async ({
    body,
  }: GetProfessionalTaxListProps) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        totalCount: number;
        ptGroups: PtGroupType[];
      }>
    >(PT_GROUP_ROUTES.listing, body);

    return data.data;
  };

  return { getProfessionalTaxList };
}

export function useGetProfessionalTaxList({
  body,
}: GetProfessionalTaxListProps) {
  const { getProfessionalTaxList } = useGetProfessionalTaxListQueryFn();

  return useQuery({
    queryKey: professionalTaxesKeys.listing(body),
    queryFn: () => getProfessionalTaxList({ body }),
    initialData: { ptGroups: [], totalCount: 0 },
  });
}
