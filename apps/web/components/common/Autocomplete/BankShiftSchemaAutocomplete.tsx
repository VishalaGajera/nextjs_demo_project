import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import type { FieldValues } from "react-hook-form";
import { formatToLocalTime } from "../../../utils/date";
import { useGetBankShiftOptions } from "./hooks/useGetBankShiftSchemeOptions";

type BankShiftSchemaAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
  hideLabel?: boolean;
};

export const BankShiftSchemaAutocomplete = <P extends FieldValues>({
  companyId,
  hideLabel = false,
  ...props
}: BankShiftSchemaAutocompleteProps<P>) => {
  const { data: bankShiftSchemeOptions } = useGetBankShiftOptions({
    companyId,
  });

  const formattedBankShiftSchemeOptions = useMemo(() => {
    return bankShiftSchemeOptions.map((bankShift) => {
      const formattedStart = formatToLocalTime(bankShift.shift_start, "HH:mm");

      const formattedEnd = formatToLocalTime(bankShift.shift_end, "HH:mm");

      return {
        ...bankShift,
        label: `${bankShift.label} (${formattedStart} - ${formattedEnd})`,
      };
    });
  }, [bankShiftSchemeOptions]);

  return (
    <Autocomplete
      label={hideLabel ? "" : "Bank Shift"}
      options={formattedBankShiftSchemeOptions}
      placeholder="Select Bank Shift"
      {...props}
    />
  );
};
