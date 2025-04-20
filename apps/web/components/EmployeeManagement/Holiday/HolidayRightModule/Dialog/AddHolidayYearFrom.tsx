import { Autocomplete, FormRow } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type {
  Control,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { HolidayListFormFieldValues } from "../../Dialog/HolidayListForm";
import {
  HolidayListForm,
  HolidayListFormSchema,
} from "../../Dialog/HolidayListForm";
import { useGetHolidaysList } from "../../Dialog/hooks/useGetHolidaysList";
import { useGetHolidayYearsList } from "../HolidayGroupList/Tabs/hooks/useGetHolidayYearsList";

const AddHolidayYearFormSchema = z.object({
  year: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

const CombinedSchema = z.intersection(
  AddHolidayYearFormSchema,
  HolidayListFormSchema
);

export type AddHolidayYearFormFieldValues = z.infer<typeof CombinedSchema>;

type AddHolidayYearFormProps = {
  defaultValues?: AddHolidayYearFormFieldValues;
  loading?: boolean;
  holidayGroupId: string;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<AddHolidayYearFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<AddHolidayYearFormFieldValues>;
  holidaysListLength: number;
};

const formDefaultValues: AddHolidayYearFormFieldValues = {
  year: null,
};

export const AddHolidayYearForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      holidayGroupId,
    }: AddHolidayYearFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const { data: holidayYearList } = useGetHolidayYearsList({
      holidayGroupId,
    });

    const yearList = holidayYearList || [];

    const lastHolidayYear = Math.max(
      ...yearList.map((item) => Number(item.year))
    );

    const {
      control,
      watch,
      setValue,
      setError,
      formState: { errors },
      handleSubmit,
    } = useForm({
      values: { ...defaultValues, year: (lastHolidayYear + 1).toString() },
      resolver: zodResolver(CombinedSchema),
      mode: "all",
    });

    const date = watch("year") ?? DateTime.now().year.toString();

    const year = DateTime.fromISO(date).year.toString();

    const { data: holidaysList, isFetching: isHolidayListLoading } =
      useGetHolidaysList({ year });

    const holidayListFromControl =
      control as unknown as Control<HolidayListFormFieldValues>;

    const holidayListFromSetValue =
      setValue as unknown as UseFormSetValue<HolidayListFormFieldValues>;

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit(formValues);
        })();
      },
      setError,
      holidaysListLength: holidaysList?.length,
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
            options={[{ label: year, value: year }]}
            required
            error={!!errors.year}
            helperText={errorMessages(errors.year?.message)}
            disabled
          />
        </FormRow>

        <HolidayListForm
          control={holidayListFromControl}
          setValue={holidayListFromSetValue}
          holidaysList={holidaysList}
          isHolidayListLoading={isHolidayListLoading}
        />
      </Stack>
    );
  }
);

AddHolidayYearForm.displayName = "AddHolidayYearForm";
