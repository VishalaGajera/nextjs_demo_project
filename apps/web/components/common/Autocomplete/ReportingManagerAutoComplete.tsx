import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { Avatar, Stack, Typography } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import { useGetEmployeeOption } from "./hooks/useGetEmployeeOption";

type ReportingManagerAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
  hideLabel?: boolean;
};

export const ReportingManagerAutoComplete = <P extends FieldValues>({
  companyId,
  hideLabel = false,
  ...props
}: ReportingManagerAutoCompleteProps<P>) => {
  const { data: reportingMemberOptions } = useGetEmployeeOption({
    companyId,
    queryParams: {
      avatar: true,
    },
  });

  return (
    <Autocomplete
      label={hideLabel ? "" : "Reporting Manager"}
      options={[
        ...reportingMemberOptions,
        { label: "No Reporting manager", value: "no-reporting-manager" },
      ]}
      isShowOptionsOnType
      placeholder="Search Reporting Manager"
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
