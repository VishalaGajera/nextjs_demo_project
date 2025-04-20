import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { Typography } from "@mui/material";
import { useMemo } from "react";
import type { FieldValues } from "react-hook-form";
import { formatToLocalTime } from "../../../utils/date";
import { useGetShiftOptions } from "./hooks/useGetShiftSchemeOptions";

type ShiftSchemeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const getShiftTypeLabel = (value: string) => {
  switch (value) {
    case "fixed":
      return "Fix";

    case "flexible":
      return "Flexi";

    default:
      return "Auto";
  }
};

export const ShiftSchemeAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: ShiftSchemeAutocompleteProps<P>) => {
  const { data: ShiftSchemeOptions } = useGetShiftOptions({
    companyId,
  });

  const formattedShiftSchemeOptions = useMemo(() => {
    return ShiftSchemeOptions.map((shift) => {
      const formattedStart = formatToLocalTime(shift.shift_start, "HH:mm");

      const formattedEnd = formatToLocalTime(shift.shift_end, "HH:mm");

      return {
        ...shift,
        label: `${shift.label} (${getShiftTypeLabel(shift.shift_type)})\n(${formattedStart} - ${formattedEnd})`,
      };
    });
  }, [ShiftSchemeOptions]);

  return (
    <Autocomplete
      label="Shift"
      options={formattedShiftSchemeOptions}
      placeholder="Select Shift"
      {...props}
      renderOption={(props, option) => (
        <li {...props}>
          <Typography style={{ whiteSpace: "pre-line" }}>
            {option.label}
          </Typography>
        </li>
      )}
    />
  );
};
