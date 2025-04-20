import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { Avatar, Stack, Typography } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { EmployeeOption } from "./hooks/useGetEmployeeOption";
import { useGetEmployeeOption } from "./hooks/useGetEmployeeOption";

type EmployeeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
  showAvatar?: boolean;
};

export const EmployeeAutocomplete = <P extends FieldValues>({
  companyId,
  showAvatar,
  ...props
}: EmployeeAutocompleteProps<P>) => {
  const { data: employeeCodeOptions } = useGetEmployeeOption({
    companyId,
    queryParams: {
      avatar: true,
      employee_code: true,
    },
  });

  return (
    <Autocomplete
      label="Employee "
      options={employeeCodeOptions as EmployeeOption[]}
      placeholder="Select Employee"
      filterOptions={(options, state) => {
        const { inputValue } = state;

        return options.filter((option) => {
          const lowerCaseInputValue = inputValue.toLowerCase();

          const labelMatch = option.label
            .toLowerCase()
            .includes(lowerCaseInputValue);

          const employeeCodeMatch = option.employee_code
            ? option.employee_code.toLowerCase().includes(lowerCaseInputValue)
            : false;

          const punchCodeMatch = option.punch_code
            ? option.punch_code.toLowerCase().includes(lowerCaseInputValue)
            : false;

          return labelMatch || employeeCodeMatch || punchCodeMatch;
        });
      }}
      renderOption={
        showAvatar
          ? (props, option) => {
              const { key, ...optionProps } = props;

              return (
                <li key={key} {...optionProps}>
                  <Stack flexDirection="row" gap="10px">
                    <Avatar
                      sx={{ width: 24, height: 24 }}
                      src={option.avatar}
                    />

                    <Typography>
                      {`${option.label}  (${option.employee_code})`}{" "}
                    </Typography>
                  </Stack>
                </li>
              );
            }
          : undefined
      }
      getOptionLabel={(
        option: { label: string; employee_code?: string } | string
      ) => {
        if (typeof option === "string") {
          return option;
        }

        return `${option.label} (${option.employee_code})`;
      }}
      {...props}
    />
  );
};
