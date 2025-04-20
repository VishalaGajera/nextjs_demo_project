import {
  CheckBox,
  DatePicker,
  FormRow,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { capitalize } from "lodash";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDebounceValue } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import {
  Debounce_Delay,
  filterNestedChangedFormFields,
} from "../../../../utils/helper";
import { BankWeeklyOffAutocomplete } from "../../../common/Autocomplete/BankWeeklyOffAutocomplete";
import { CompanyAutocomplete } from "../../../common/Autocomplete/CompanyAutocomplete";
import { useGetBankHolidaysByYearMonth } from "./hooks/useGetBankHolidaysByYearMonth";

const BankPayScheduleFormSchema = z.object({
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  month_year: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  weekly_off: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_weekly_off_paid: z.boolean().nullable(),
  bank_month_days: z.union([z.number().nullable(), z.string().nullable()]),
  bank_salary_days: z.union([z.number().nullable(), z.string().nullable()]),
  month_dates: z
    .array(
      z.object({
        date: z.string(),
        is_weekly_off: z.boolean(),
        is_holiday: z.boolean(),
      })
    )
    .optional(),
});

export type BankPayScheduleFormFieldValues = z.infer<
  typeof BankPayScheduleFormSchema
>;

type BankPayScheduleFormProps = {
  defaultValues?: BankPayScheduleFormFieldValues;
  loading?: boolean;
  isEdit?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BankPayScheduleFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<BankPayScheduleFormFieldValues>;
};

const formDefaultValues: BankPayScheduleFormFieldValues = {
  company_id: null,
  description: null,
  month_year: DateTime.now().toFormat("yyyy-MM-dd"),
  weekly_off: null,
  is_weekly_off_paid: false,
  bank_month_days: null,
  bank_salary_days: null,
};

export const BankPayScheduleForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      isEdit = false,
    }: BankPayScheduleFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const theme = useTheme();

    const { slate } = theme.palette.app.color;

    const { t } = useTranslation();

    const searchParams = useSearchParams();

    const mode = searchParams.get("page");

    const isViewMode = mode === "view-bank-pay-schedule";

    const {
      watch,
      control,
      setValue,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(BankPayScheduleFormSchema),
      mode: "all",
    });

    const companyId = watch("company_id");

    const monthYear = watch("month_year");

    const monthDates = watch("month_dates");

    const weeklyOff = watch("weekly_off");

    const bankMonthDays = watch("bank_month_days");

    const isWeeklyOffPaid = watch("is_weekly_off_paid");

    const [company_id] = useDebounceValue(companyId ?? "", Debounce_Delay);

    const [month_year] = useDebounceValue(
      monthYear ? DateTime.fromISO(monthYear).toFormat("yyyy-MM") : "",
      Debounce_Delay
    );

    const { data: bankHolidayData } = useGetBankHolidaysByYearMonth({
      companyId: company_id,
      yearMonth: month_year,
    });

    const dates = DateTime.fromFormat(month_year, "yyyy-MM").startOf("month");

    useEffect(() => {
      if (dates) {
        const holidayMap = new Map(
          (bankHolidayData || []).map((holiday) => [
            DateTime.fromISO(holiday.holiday_date).toFormat("dd-MM-yyyy"),
            holiday.holiday_name,
          ])
        );

        const generatedDates = Array.from(
          { length: dates.daysInMonth ?? 0 },
          (_, i) => {
            const date = dates.plus({ days: i });

            const formattedDate = date.toFormat("dd-MM-yyyy");

            const formattedDay = date.toFormat("EEEE").toLowerCase().trim();

            return {
              date: `${formattedDate} (${capitalize(formattedDay)})`,
              is_weekly_off: formattedDay === weeklyOff,
              is_holiday: holidayMap.has(formattedDate),
            };
          }
        );

        const weeklyOffCount = generatedDates.reduce(
          (count, day) => (day.is_weekly_off ? count + 1 : count),
          0
        );

        const newBankMonthDays = generatedDates.length;

        const newBankSalaryDays = isWeeklyOffPaid
          ? newBankMonthDays
          : newBankMonthDays - weeklyOffCount;

        setValue("bank_month_days", newBankMonthDays);

        setValue("bank_salary_days", newBankSalaryDays);

        setValue("month_dates", generatedDates);
      }
    }, [
      month_year,
      weeklyOff,
      isWeeklyOffPaid,
      bankMonthDays,
      bankHolidayData,
    ]);

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(
            { ...formValues, month_year },
            { ...dirtyFields, month_year: !isEdit, is_weekly_off_paid: true }
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const { description, weekly_off, bank_month_days, bank_salary_days } =
      errors;

    return (
      <Stack direction="row" gap="20px">
        <Stack gap="20px" width="50%">
          <FormRow fullWidth>
            <CompanyAutocomplete
              name="company_id"
              loading={loading}
              control={control}
              required
              disabled={isEdit || isViewMode}
              error={!!errors.company_id}
              helperText={errorMessages(errors.company_id?.message)}
            />

            <TextField
              label="Description"
              name="description"
              loading={loading}
              control={control}
              multiline
              disabled={isViewMode}
              error={!!description}
              helperText={errorMessages(description?.message)}
            />
          </FormRow>

          <Typography variant="subtitle1" fontWeight={500}>
            Configure Bank Pay Schedule
          </Typography>

          <FormRow maxColumn={2}>
            <DatePicker
              name="month_year"
              label="Month/Year"
              format="MMM yyyy"
              views={["year", "month"]}
              control={control}
              required
              disabled={isViewMode || isEdit}
              error={!!errors.month_year}
              helperText={errorMessages(errors.month_year?.message)}
              loading={loading}
            />

            <BankWeeklyOffAutocomplete
              name="weekly_off"
              loading={loading}
              control={control}
              required
              disabled={isEdit || isViewMode}
              error={!!weekly_off}
              helperText={errorMessages(weekly_off?.message)}
            />
          </FormRow>

          <Stack direction="row" gap="10px">
            <CheckBox
              name="is_weekly_off_paid"
              control={control}
              size="small"
              disabled={isViewMode || isEdit}
              loading={loading}
            />

            <Typography variant="body1" fontWeight={500}>
              Is bank weekly offs are paid?
            </Typography>
          </Stack>

          <FormRow maxColumn={2}>
            <TextField
              label="Bank Month Days"
              type="number"
              name="bank_month_days"
              disabled
              control={control}
              loading={loading}
              error={!!bank_month_days}
              helperText={errorMessages(bank_month_days?.message)}
            />

            <TextField
              label="Bank Salary Days"
              type="number"
              name="bank_salary_days"
              disabled
              control={control}
              loading={loading}
              error={!!bank_salary_days}
              helperText={errorMessages(bank_salary_days?.message)}
            />
          </FormRow>
        </Stack>

        <Stack width="50%">
          <PadBox padding={{ paddingTop: "30px" }}>
            <Box
              sx={{
                border: "1px solid",
                borderRadius: "4px",
                borderColor: slate[700],
                maxHeight: "750px",
                overflow: "auto",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: slate[700] }}>
                    {["Date", "Is Weekly Off?", "Is Holiday?"].map(
                      (text, index) => (
                        <TableCell key={index + 1}>
                          <Typography variant="body1" fontWeight="500">
                            {text}
                          </Typography>
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {monthDates?.map((item, index) => {
                    return (
                      <TableRow
                        sx={{ verticalAlign: "baseline" }}
                        key={uuidv4()}
                      >
                        <TableCell>{item.date}</TableCell>

                        <TableCell>
                          {loading ? (
                            <Skeleton width="20px" sx={{ minHeight: "30px" }} />
                          ) : (
                            <CheckBox
                              control={control}
                              name={`month_dates.${index}.is_weekly_off`}
                              size="small"
                              disabled
                            />
                          )}
                        </TableCell>

                        <TableCell>
                          {loading ? (
                            <Skeleton width="20px" sx={{ minHeight: "30px" }} />
                          ) : (
                            <CheckBox
                              control={control}
                              name={`month_dates.${index}.is_holiday`}
                              loading={loading}
                              size="small"
                              disabled
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </PadBox>
        </Stack>
      </Stack>
    );
  }
);

BankPayScheduleForm.displayName = "BankPayScheduleForm";
