import { useQuery } from "@tanstack/react-query";
import { PT_GROUP_ROUTES } from "../../../../../../../constants/routes/payroll/settings/taxes-deductions/pt-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { professionalTaxesKeys } from "../../../../../../../queryKeysFactories/professionalTaxes";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";

type useGetProfessionalTaxWithIdProps = {
  ptId: string;
};

export type MonthlyVariation = {
  id: string;
  month: number;
  tax_amount: number;
};

export type TaxSlab = {
  id: string;
  start_amount: number | null;
  end_amount: number | null;
  tax_amount: number | null;
  monthly_variations: MonthlyVariation[];
};

export type PTGroupData = {
  id: string;
  state_id: string;
  state_name: string;
  deduction_cycle_type: "half_yearly" | "monthly" | "quarterly" | "yearly";
  is_gender_specific: boolean;
  tax_slabs: TaxSlab[] & { male: TaxSlab[]; female: TaxSlab[] };
};

export function useGetProfessionalTaxWithId({
  ptId,
}: useGetProfessionalTaxWithIdProps) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchProfessionalTaxData = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<PTGroupData>>(
      PT_GROUP_ROUTES.get(ptId)
    );

    return data;
  };

  return useQuery({
    queryKey: professionalTaxesKeys.get(ptId),
    queryFn: fetchProfessionalTaxData,
    enabled: !!ptId,
  });
}
