import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { DateTime } from "luxon";
import { useMemo } from "react";
import type { FieldValues } from "react-hook-form";

type YearPeriodAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  joiningDate: string;
  leavePlanStartMonth: number;
};

export const YearPeriodAutocomplete = <P extends FieldValues>({
  loading,
  joiningDate,
  leavePlanStartMonth,
  ...props
}: YearPeriodAutocompleteProps<P>) => {
  const joiningYear = DateTime.fromISO(joiningDate).year;

  const currentYear = DateTime.now().year;

  const yearPeriodOptions = useMemo(() => {
    const options = [];

    const validLeavePlanStartMonth =
      Number.isInteger(leavePlanStartMonth) &&
      leavePlanStartMonth >= 1 &&
      leavePlanStartMonth <= 12
        ? leavePlanStartMonth
        : 1;

    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      const from = DateTime.local(year, validLeavePlanStartMonth, 1);

      const to = from.plus({ years: 1 }).minus({ days: 1 });

      options.push({
        label: `${from.toFormat("MMM yyyy")} - ${to.toFormat("MMM yyyy")}`,
        value: `${from.toISODate()}/${to.toISODate()}`,
      });
    }

    return options;
  }, [joiningYear, leavePlanStartMonth, currentYear]);

  return (
    <Autocomplete
      options={yearPeriodOptions}
      placeholder="Select Time Period"
      loading={loading}
      {...props}
    />
  );
};
