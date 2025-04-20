import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { CURRENT, SAVING } from "./hooks/constant";

const accountTypes = {
  [CURRENT]: "Current",
  [SAVING]: "Saving",
};

export const accountTypeOptions = [
  { label: accountTypes[CURRENT], value: CURRENT },
  { label: accountTypes[SAVING], value: SAVING },
];

export type AccountType = keyof typeof accountTypes;

export const AccountTypeSchema = z.enum([CURRENT, SAVING]);

type AccountTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const AccountTypeAutocomplete = <P extends FieldValues>(
  props: AccountTypeAutocompleteProps<P>
) => {
  return (
    <Autocomplete
      label="Account Type"
      options={accountTypeOptions}
      placeholder="Select Account Type"
      {...props}
    />
  );
};
