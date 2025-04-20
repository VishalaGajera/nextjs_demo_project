import { useQuery } from "@tanstack/react-query";
import { GRATUITY_GROUP_ROUTES } from "../../../../../../../../../constants/routes/payroll/settings/contributions/gratuity-group/routes";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { gratuityKeys } from "../../../../../../../../../queryKeysFactories/gratuity";
import { type ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import { type GratuityFormType } from "../../../Dialogs/GratuityForm";

export type GratuityInfo = {
  id: string;
  company_name: string;
  min_tenure_year: number;
  number_of_days_in_year: number;
  avg_monthly_working_day: number;
  action_by: string;
  action_at: string;
  full_count: string;
};

export type GetGratuitByIdyArgs = {
  gratuityId: string;
};

export function useGetGratuityById({ gratuityId }: GetGratuitByIdyArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchGratuity = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<GratuityFormType>>(
      GRATUITY_GROUP_ROUTES.get(gratuityId)
    );

    return data;
  };

  return useQuery({
    queryKey: gratuityKeys.get(gratuityId),
    queryFn: fetchGratuity,
    enabled: !!gratuityId,
  });
}
