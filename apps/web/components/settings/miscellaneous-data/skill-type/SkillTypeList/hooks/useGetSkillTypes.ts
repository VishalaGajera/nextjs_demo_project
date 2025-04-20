import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { skillTypeKeys } from "../../../../../../queryKeysFactories/skillType";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { SKILL_TYPE_ROUTES } from "../../../../../../constants/routes/settings/skill-type/routes";

export type SkillType = {
  id: string;
  company_id: string;
  skill_type_code: string;
  skill_type_name: string;
  description: string;
  is_active: boolean;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetSkillTypesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetSkillTypesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getSkillTypes = async ({ body }: GetSkillTypesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        skillTypes: SkillType[];
        totalCount: number;
      }>
    >(SKILL_TYPE_ROUTES.listing, body);

    return data.data;
  };

  return { getSkillTypes };
}

//NOTE: for future use
export function useGetSkillTypes({ body }: GetSkillTypesArgs) {
  const { getSkillTypes } = useGetSkillTypesQueryFn();

  return useQuery({
    queryKey: skillTypeKeys.listing(body),
    queryFn: () => getSkillTypes({ body }),
    initialData: { skillTypes: [], totalCount: 0 },
  });
}
