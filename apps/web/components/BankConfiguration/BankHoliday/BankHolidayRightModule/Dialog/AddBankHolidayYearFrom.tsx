import { Autocomplete, FormRow } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useGetHolidaysList } from "../../../../EmployeeManagement/Holiday/Dialog/hooks/useGetHolidaysList";
import { useGetBankHolidayYearsList } from "../Tabs/hooks/useGetBankHolidayYearsList";
import { BankHolidayYearForm } from "./BankHolidayYearForm";

const currentYear = DateTime.now().year;

const allowedYears = [currentYear - 1, currentYear, currentYear + 1].map(
  String
);

const AddBankHolidayYearFormSchema = z.object({
  year: z.enum(allowedYears as [string, ...string[]], {
    errorMap: () => ({
      message: `Year must be one of ${allowedYears.join(", ")}.`,
    }),
  }),
  selectBankHolidays: z
    .array(z.object({ id: z.string(), value: z.boolean() }))
    .nullable()
    .optional(),
});

export type AddBankHolidayYearFormFieldValues = z.infer<
  typeof AddBankHolidayYearFormSchema
>;

type AddBankHolidayYearFormProps = {
  defaultValues?: AddBankHolidayYearFormFieldValues;
  loading?: boolean;
  companyId: string;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<AddBankHolidayYearFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<AddBankHolidayYearFormFieldValues>;
  bankHolidaysListLength: number;
};

const formDefaultValues: AddBankHolidayYearFormFieldValues = {
  year: "",
  selectBankHolidays: null,
};

export const AddBankHolidayYearForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      companyId,
    }: AddBankHolidayYearFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const { data: bankHolidayYearList } = useGetBankHolidayYearsList({
      companyId,
    });

    const yearList = bankHolidayYearList || [];

    const options = allowedYears.map((year) => ({ label: year, value: year }));

    const lastBankHolidayYear =
      yearList.length > 0
        ? Math.max(...yearList.map((item) => Number(item.year)))
        : currentYear;

    const {
      control,
      watch,
      setValue,
      setError,
      formState: { errors },
      handleSubmit,
    } = useForm({
      values: { ...defaultValues, year: (lastBankHolidayYear + 1).toString() },
      resolver: zodResolver(AddBankHolidayYearFormSchema),
      mode: "all",
    });

    const date = watch("year") ?? DateTime.now().year.toString();

    const year = DateTime.fromISO(date).year.toString();

    const { data: bankHolidaysList, isFetching: isBankHolidayListLoading } =
      useGetHolidaysList({ year });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit(formValues);
        })();
      },
      setError,
      bankHolidaysListLength: bankHolidaysList?.length,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="10px">
        <FormRow maxColumn={1}>
          <Autocomplete
            name="year"
            control={control}
            label="Year"
            sx={{ width: "240px" }}
            placeholder="Select Year"
            loading={loading}
            options={options}
            required
            error={!!errors.year}
            helperText={errorMessages(errors.year?.message)}
          />
        </FormRow>

        <BankHolidayYearForm
          control={control}
          setValue={setValue}
          bankHolidaysList={bankHolidaysList}
          isBankHolidayListLoading={isBankHolidayListLoading}
        />
      </Stack>
    );
  }
);

AddBankHolidayYearForm.displayName = "AddBankHolidayYearForm";
