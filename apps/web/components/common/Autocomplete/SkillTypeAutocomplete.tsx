import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetSkillTypeOptions } from "./hooks/useGetSkillTypeOptions";

type SkillTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const SkillTypeAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: SkillTypeAutocompleteProps<P>) => {
  const { data: skillTypeOptions } = useGetSkillTypeOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Skill type"
      options={skillTypeOptions}
      placeholder="Select Skill type"
      {...props}
    />
  );
};
