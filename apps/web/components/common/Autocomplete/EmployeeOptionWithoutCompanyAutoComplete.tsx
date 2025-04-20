import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { Avatar, Stack, Typography } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import { useGetEmployeeOptionWithoutCompany } from "./hooks/useGetEmployeeOptionWithoutCompany";

type EmployeeOptionWithoutCompanyAutoCompleteProps<P extends FieldValues> =
  Omit<AutocompleteProps<P>, "options"> & {
    hideLabel?: boolean;
  };

export const EmployeeOptionWithoutCompanyAutoComplete = <
  P extends FieldValues,
>({
  hideLabel = false,
  ...props
}: EmployeeOptionWithoutCompanyAutoCompleteProps<P>) => {
  const { data: reportingMemberOptions } = useGetEmployeeOptionWithoutCompany({
    queryParams: {
      avatar: true,
    },
  });

  return (
    <Autocomplete
      label={hideLabel ? "" : "Employee"}
      options={reportingMemberOptions}
      placeholder="Select Employee"
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
      {...props}
    />
  );
};
