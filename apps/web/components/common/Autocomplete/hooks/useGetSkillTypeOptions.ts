import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { skillTypeKeys } from "../../../../queryKeysFactories/skillType";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { SKILL_TYPE_ROUTES } from "../../../../constants/routes/settings/skill-type/routes";

type UseGetSkillTypeArgs = {
  companyId: string;
};

export function useGetSkillTypeOptions({ companyId }: UseGetSkillTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSkillType = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      SKILL_TYPE_ROUTES.options(companyId)
    );

    return data?.data;
  };

  return useQuery({
    queryKey: skillTypeKeys.options(companyId),
    queryFn: fetchSkillType,
    enabled: !!companyId,
    initialData: [],
  });
}
