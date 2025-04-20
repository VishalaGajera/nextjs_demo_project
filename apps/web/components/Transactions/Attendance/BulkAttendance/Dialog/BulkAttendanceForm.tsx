import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";

import {
  DatePicker,
  DateTimePicker,
  FormRow,
  TextField,
} from "@codezee/sixtify-brahma";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../utils/helper";

const BulkAttendanceFormSchema = z
  .object({
    employee_ids: z.array(z.string()).nullable(),
    to_date: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    from_date: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    in_time: z.string().nullable(),
    out_time: z.string().nullable(),
    remark: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.in_time && data.out_time) {
      const inTime = DateTime.fromISO(data.in_time);

      const outTime = DateTime.fromISO(data.out_time);

      if (inTime > outTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "In Time must be earlier than Out Time",
          path: ["in_time"],
        });
      }
    } else if (!data.in_time && !data.out_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "In Time or Out Time cannot be left blank or empty.",
        path: ["in_time"],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "In Time or Out Time cannot be left blank or empty.",
        path: ["out_time"],
      });
    }

    const isValidateDate = (field: "in_time" | "out_time") => {
      const selectedDate = data[field];

      if (data.from_date && selectedDate) {
        const date = DateTime.fromISO(data.from_date);

        const currentDate = DateTime.fromISO(selectedDate);

        const minDate = currentDate.minus({ days: 2 });

        const maxDate = currentDate.plus({ days: 0 });

        if (date <= minDate || date > maxDate) {
          if (data.in_time) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Enter or choose a valid date and time.",
            });
          }
        }
      }
    };

    if (data.in_time) {
      isValidateDate("in_time");
    }

    if (data.from_date) {
      isValidateDate("out_time");
    }
  });

export type BulkAttendanceFormValues = z.infer<typeof BulkAttendanceFormSchema>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BulkAttendanceFormValues>) => void
  ) => void;
  setError: UseFormSetError<BulkAttendanceFormValues>;
};

type BulkAttendanceFormProps = {
  defaultValues?: BulkAttendanceFormValues;
  loading?: boolean;
  employeeIds: string[];
};

const formDefaultValues: BulkAttendanceFormValues = {
  employee_ids: [],
  to_date: null,
  from_date: null,
  in_time: null,
  out_time: null,
  remark: null,
};

export const BulkAttendanceForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      employeeIds,
    }: BulkAttendanceFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const initialValues = useMemo(() => {
      return {
        ...defaultValues,
        employee_id: employeeIds || null,
      };
    }, [employeeIds]);

    const {
      watch,
      control,
      setValue,
      setError,
      clearErrors,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm<BulkAttendanceFormValues>({
      values: initialValues,
      resolver: zodResolver(BulkAttendanceFormSchema),
      mode: "all",
    });

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            employee_ids: true,
          });

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const fromDate = watch("from_date");

    const toDate = watch("to_date");

    const inTime = watch("in_time");

    const outTime = watch("out_time");

    const handleLogInDate = (dateTime: DateTime) => {
      if (!fromDate || !dateTime) {
        return false;
      }

      const currentDate = DateTime.fromISO(fromDate);

      const isGreaterThanCurrentDate =
        currentDate > dateTime || currentDate.plus({ day: 1 }) < dateTime;

      return isGreaterThanCurrentDate;
    };

    useMemo(() => {
      if (inTime) {
        setValue("in_time", null, {
          shouldDirty: true,
        });
      }

      if (outTime) {
        setValue("out_time", null, {
          shouldDirty: true,
        });
      }
    }, [fromDate, toDate]);

    useMemo(() => {
      // eslint-disable-next-line sonarjs/prefer-nullish-coalescing
      if (inTime || outTime) {
        clearErrors("in_time");
        clearErrors("out_time");
      }

      if (
        inTime &&
        outTime &&
        DateTime.fromISO(inTime) > DateTime.fromISO(outTime)
      ) {
        setError("in_time", {
          type: "manual",
          message: "In Time must be earlier than Out Time",
        });
      }
    }, [inTime, outTime]);

    const calendarOpeningDate = useMemo(() => {
      return fromDate ? DateTime.fromISO(fromDate) : DateTime.fromISO("");
    }, [fromDate]);

    return (
      <Stack gap="20px">
        <FormRow maxColumn={2}>
          <DatePicker
            maxDate={
              toDate ? DateTime.fromISO(toDate) : DateTime.now().endOf("month")
            }
            name="from_date"
            control={control}
            loading={loading}
            label="From Date"
            required
            setError={setError}
            error={!!errors.from_date}
            helperText={errorMessages(errors.from_date?.message)}
          />

          <DatePicker
            name="to_date"
            minDate={fromDate ? DateTime.fromISO(fromDate) : undefined}
            control={control}
            loading={loading}
            label="To Date"
            setError={setError}
            required
            error={!!errors.to_date}
            helperText={errorMessages(errors.to_date?.message)}
            maxDate={DateTime.now().endOf("month")}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <DateTimePicker
            name="in_time"
            control={control}
            label="In Time"
            loading={loading}
            disabled={!fromDate || !toDate}
            shouldDisableDate={handleLogInDate}
            error={!!errors.in_time}
            helperText={errorMessages(errors.in_time?.message)}
            maxDate={calendarOpeningDate.endOf("month")}
          />

          <DateTimePicker
            label="Out Time"
            name="out_time"
            control={control}
            loading={loading}
            shouldDisableDate={handleLogInDate}
            disabled={!fromDate || !toDate}
            error={!!errors.out_time}
            helperText={errorMessages(errors.out_time?.message)}
            maxDate={calendarOpeningDate.endOf("month")}
          />
        </FormRow>

        <TextField
          control={control}
          label="Remark"
          name="remark"
          fullWidth
          multiline
          loading={loading}
        />
      </Stack>
    );
  }
);

BulkAttendanceForm.displayName = "BulkAttendanceForm";
