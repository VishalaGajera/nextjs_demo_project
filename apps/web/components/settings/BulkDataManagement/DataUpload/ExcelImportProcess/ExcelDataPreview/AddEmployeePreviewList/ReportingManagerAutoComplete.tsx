import {
  Autocomplete,
  type AutocompleteProps,
  type Option,
} from "@codezee/sixtify-brahma";
import { Avatar, Stack, Typography } from "@mui/material";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { EMPLOYEE } from "../constant";

type ReportingManagerAutoCompleteProps<T extends FieldValues> =
  AutocompleteProps<T> & {
    fieldName: keyof T; // Dynamically infer the key from the provided type
    node: { rowIndex: number };
    control: Control<T>; // Dynamically handle the control for the form
    error: FieldErrors<T>; // Dynamically handle the errors
    errorMessage: string;
    loading: boolean;
    disabled: boolean;
    options: Option[];
  };

export const ReportingManagerAutoComplete = <T extends FieldValues>({
  node,
  error,
  errorMessage,
  loading,
  fieldName,
  control,
  options,
  disabled = false,
}: ReportingManagerAutoCompleteProps<T>) => {
  const index = node.rowIndex ?? 0;

  return (
    <Autocomplete
      name={`${EMPLOYEE}.${index}.${String(fieldName)}` as Path<T>}
      loading={loading}
      options={options}
      placeholder="Select"
      control={control}
      error={!!error}
      disabled={disabled}
      helperText={errorMessage}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;

        return (
          <li key={key} {...optionProps}>
            <Stack flexDirection="row" gap="10px">
              <Avatar sx={{ width: 24, height: 24 }} src={option.avatar} />

              <Typography>{`${option.label}`} </Typography>
            </Stack>
          </li>
        );
      }}
      getOptionLabel={(option: { label: string } | string) => {
        if (typeof option === "string") {
          return option;
        }

        return `${option.label}`;
      }}
    />
  );
};
