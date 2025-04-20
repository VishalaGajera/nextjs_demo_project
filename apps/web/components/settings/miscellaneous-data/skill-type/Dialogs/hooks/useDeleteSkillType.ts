"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { skillTypeKeys } from "../../../../../../queryKeysFactories/skillType";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { SkillType } from "../../SkillTypeList/hooks/useGetSkillTypes";
import { SKILL_TYPE_ROUTES } from "../../../../../../constants/routes/settings/skill-type/routes";

type DeleteSkillTypeApiResponse = ApiSuccessResponse<SkillType>;

type UseDeleteSkillTypeArgs = {
  options: UseMutationOptions<DeleteSkillTypeApiResponse, ApiErrorResponse>;
  skillTypeId: string;
};

export function useDeleteSkillType({
  skillTypeId,
  options = {},
}: UseDeleteSkillTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: skillTypeKeys.delete(skillTypeId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteSkillTypeApiResponse>(
        SKILL_TYPE_ROUTES.delete(skillTypeId)
      );

      return data;
    },
    ...options,
  });
}
