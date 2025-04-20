import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import type { OptionsType } from "../../../types/options";
import { BANK, CASH, CHEQUE } from "./hooks/constant";

const paymentTypes = {
  [CASH]: "Cash",
  [BANK]: "Bank",
  [CHEQUE]: "Cheque",
};

export const paymentTypeOption: OptionsType[] = [
  { label: paymentTypes[CASH], value: CASH },
  { label: paymentTypes[BANK], value: BANK },
  { label: paymentTypes[CHEQUE], value: CHEQUE },
];

export type PaymentType = keyof typeof paymentTypes;

export const PaymentTypeSchema = z.enum([CASH, BANK, CHEQUE]).nullable();

type PaymentTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const PaymentTypeAutocomplete = <P extends FieldValues>(
  props: PaymentTypeAutocompleteProps<P>
) => {
  return (
    <Autocomplete
      label="Payment Type"
      options={paymentTypeOption}
      placeholder="Select Payment Type"
      {...props}
    />
  );
};
