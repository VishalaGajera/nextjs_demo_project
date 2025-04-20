import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { useTheme } from "@mui/material";
import type { FieldValues } from "react-hook-form";

type ApproverAutocompleteProps<P extends FieldValues> = AutocompleteProps<P>;

export const ApproverAutocomplete = <P extends FieldValues>({
  options,
  ...props
}: ApproverAutocompleteProps<P>) => {
  const theme = useTheme();

  const { sapphireBlue, black } = theme.palette.app.color;

  return (
    <Autocomplete
      label="Employees / Roles"
      placeholder="Search Employees / Roles"
      options={options}
      multiple
      isShowAvatar
      isShowOptionsOnType
      isShowSelectAll={false}
      sx={{
        minWidth: "900px",
        "& .MuiAutocomplete-tag": {
          backgroundColor: sapphireBlue[300],
          color: black[900],
        },
      }}
      {...props}
    />
  );
};
