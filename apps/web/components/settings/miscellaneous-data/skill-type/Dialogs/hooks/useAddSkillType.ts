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

type AddSkillTypeApiSuccessResponse = ApiSuccessResponse<SkillType>;

type UseAddSkillTypeArgs = {
  options: UseMutationOptions<
    AddSkillTypeApiSuccessResponse,
    ApiErrorResponse<SkillTypeFormFieldValues>,
    Partial<SkillTypeFormFieldValues>
  >;
};

export function useAddSkillType({ options = {} }: UseAddSkillTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: skillTypeKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddSkillTypeApiSuccessResponse>(
        SKILL_TYPE_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
