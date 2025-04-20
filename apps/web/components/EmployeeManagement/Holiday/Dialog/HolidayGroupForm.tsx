import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { isEmpty } from "lodash";
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
import { useEnableDisableButtonToggle } from "../../../../hooks/useEnableDisableButtonToggle";
import { CompanyAutocomplete } from "../../../common/Autocomplete/CompanyAutocomplete";
import { CurrentDateAutocomplete } from "../../../common/Autocomplete/CurrentDateAutocomplete";
import type { HolidayListFormFieldValues } from "./HolidayListForm";
import { HolidayListForm, HolidayListFormSchema } from "./HolidayListForm";
import { useGetHolidaysList } from "./hooks/useGetHolidaysList";

const HolidayGroupFormSchema = z.object({
  year: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  holiday_group_name: z
    .string()
    .max(50, "employee.name.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

const CombinedSchema = z.intersection(
  HolidayGroupFormSchema,
  HolidayListFormSchema
);

export type HolidayGroupFormFieldValues = z.infer<typeof CombinedSchema>;

type HolidayGroupFormProps = {
  defaultValues?: HolidayGroupFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<HolidayGroupFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<HolidayGroupFormFieldValues>;
  holidaysListLength: number;
};

const formDefaultValues: HolidayGroupFormFieldValues = {
  year: DateTime.now().year.toString(),
  company_id: null,
  holiday_group_name: null,
};

export const HolidayGroupForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: HolidayGroupFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      control,
      watch,
      setValue,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
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

    useEnableDisableButtonToggle({
      errors,
      isFormChanged: !isEmpty(dirtyFields),
    });

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
        <FormRow maxColumn={3}>
          <CompanyAutocomplete
            control={control}
            loading={loading}
            error={!!errors.company_id}
            helperText={errorMessages(errors.company_id?.message)}
            name="company_id"
            required
          />
          <TextField
            name="holiday_group_name"
            control={control}
            loading={loading}
            label="Holiday Group"
            required
            error={!!errors.holiday_group_name}
            helperText={errorMessages(errors.holiday_group_name?.message)}
            placeholder="Enter Holiday Group Name"
          />

          <CurrentDateAutocomplete
            name="year"
            control={control}
            loading={loading}
            error={!!errors.year}
            helperText={errorMessages(errors.year?.message)}
            required
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

HolidayGroupForm.displayName = "HolidayGroupForm";
