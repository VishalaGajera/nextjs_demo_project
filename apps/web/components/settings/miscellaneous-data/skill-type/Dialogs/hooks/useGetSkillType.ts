import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { skillTypeKeys } from "../../../../../../queryKeysFactories/skillType";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { SkillType } from "../../SkillTypeList/hooks/useGetSkillTypes";
import { SKILL_TYPE_ROUTES } from "../../../../../../constants/routes/settings/skill-type/routes";

type UseGetSkillTypeArgs = {
  skillTypeId: SkillType["id"];
};

export function useGetSkillType({ skillTypeId }: UseGetSkillTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSkillType = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<SkillType>>(
      SKILL_TYPE_ROUTES.get(skillTypeId)
    );

    return data;
  };

  return useQuery({
    queryKey: skillTypeKeys.get(skillTypeId),
    queryFn: fetchSkillType,
    enabled: !!skillTypeId,
  });
}
