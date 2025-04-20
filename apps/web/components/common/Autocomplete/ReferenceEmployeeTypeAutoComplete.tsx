import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { type FieldValues, type Path, type PathValue } from "react-hook-form";

type ReferenceEmployeeTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  textFieldName: Path<P>;
  name: Path<P>;
  options: { label: string; value: string | number }[];
  setValue: (
    name: Path<P>,
    value: PathValue<P, Path<P>>,
    options?: Record<string, boolean>
  ) => void;
};

export const ReferenceEmployeeTypeAutoComplete = <P extends FieldValues>({
  loading,
  name,
  textFieldName,
  options,
  setValue,
  ...props
}: ReferenceEmployeeTypeAutocompleteProps<P>) => {
  return (
    <Autocomplete
      name={name}
      freeSolo
      label="Reference Name"
      options={options}
      placeholder="Select Reference Name"
      loading={loading}
      onInputChange={(_, newValue, reason) => {
        if (reason === "input") {
          setValue(name as Path<P>, null as P[keyof P]);
          setValue(textFieldName, newValue as PathValue<P, Path<P>>, {
            shouldDirty: false,
            shouldValidate: false,
          });
        } else if (!newValue) {
          setValue(name as Path<P>, null as P[keyof P]);
          setValue(textFieldName, null as PathValue<P, Path<P>>);
        }
      }}
      {...props}
    />
  );
};
