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
import type { SkillTypeFormFieldValues } from "../SkillTypeForm";
import { SKILL_TYPE_ROUTES } from "../../../../../../constants/routes/settings/skill-type/routes";

type EditSkillTypeApiResponse = ApiSuccessResponse<SkillType>;

type UseEditSkillTypeArgs = {
  options: UseMutationOptions<
    EditSkillTypeApiResponse,
    ApiErrorResponse<SkillTypeFormFieldValues>,
    Partial<SkillTypeFormFieldValues>
  >;
  skillTypeId: string;
};

export function useEditSkillType({
  skillTypeId,
  options = {},
}: UseEditSkillTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: skillTypeKeys.edit(skillTypeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditSkillTypeApiResponse>(
        SKILL_TYPE_ROUTES.patch(skillTypeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
