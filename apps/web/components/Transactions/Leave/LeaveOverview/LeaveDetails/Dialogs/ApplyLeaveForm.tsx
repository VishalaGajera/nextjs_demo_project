import {
  DatePicker,
  formatDate,
  FormRow,
  PadBox,
  RadioGroupField,
  TextField,
  toasts,
  Tooltip,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { t } from "i18next";
import { isEqual } from "lodash";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import { dateDaysDifference } from "../../../../../../utils/date";
import {
  Debounce_Delay,
  filterChangedFormFields,
} from "../../../../../../utils/helper";
import { EmployeeAutocomplete } from "../../../../../common/Autocomplete/EmployeeAutoComplete";
import { LeaveTypePerEmployeeAutocomplete } from "../../../../../common/Autocomplete/LeaveTypePerEmployeeAutocomplete";
import { FileUploadField } from "../../../../../common/FileUploadField";
import type { LeaveEmployeeDetails } from "../hooks/useGetLeaveEmployeeDetails";
import { getLeaveDays } from "../PendingLeaveRequests/Dialogs/ActionDialogs/LeaveDetailsSection";
import {
  useGetLeaveValidation,
  type TeamRequests,
} from "./hooks/useGetLeaveValidation";

export const ApplyLeaveFormSchema = z
  .object({
    leave_type_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    from_date: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    to_date: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    from_half: z.string().nullable(),
    to_half: z.string().nullable(),
    attachments: z.array(z.string()).optional().nullable(),
    notifies: z.array(z.string()).optional().nullable(),
    reason: z
      .string()
      .max(500, "common.maxCharacterLength")
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.from_date === data.to_date) {
      if (!data.from_half) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["from_half"],
          message: "common.required",
        });
      }
    } else {
      if (!data.from_half) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["from_half"],
          message: "common.required",
        });
      }

      if (!data.to_half) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["to_half"],
          message: "common.required",
        });
      }
    }
  });

export type ApplyLeaveFormFieldValues = z.infer<typeof ApplyLeaveFormSchema>;

type ApplyLeaveProps = {
  leaveDetailsData?: LeaveEmployeeDetails;
  leaveRequestId?: string;
  fromPlanDate: string;
  toPlanDate: string;
  defaultValues?: ApplyLeaveFormFieldValues;
  setHasValidationErrors: (value: boolean) => void;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<ApplyLeaveFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<ApplyLeaveFormFieldValues>;
};

export const applyLeaveDefaultValues: ApplyLeaveFormFieldValues = {
  leave_type_id: null,
  from_date: null,
  to_date: null,
  from_half: "full_day",
  to_half: null,
  attachments: null,
  notifies: null,
  reason: null,
};

export const calculateLeaveDetails = (
  from_date: string,
  to_date: string,
  from_half: string | null,
  to_half: string | null
  // eslint-disable-next-line sonarjs/cognitive-complexity
): string => {
  const dateDifference = dateDaysDifference(from_date, to_date);

  if (
    isEqual(from_date, to_date) &&
    ((from_half === "first_half" && to_half === "first_half") ||
      (from_half === "second_half" && to_half === "second_half"))
  ) {
    return "0.5 days";
  }

  if (isEqual(from_half, to_half)) {
    return `${dateDifference + 0.5} days`;
  }

  if (from_half === "second_half" && to_half === "first_half") {
    return `${dateDifference} days`;
  }

  return `${dateDifference + 1} days`;
};

export const ApplyLeaveForm = forwardRef(
  (
    {
      defaultValues = applyLeaveDefaultValues,
      leaveRequestId,
      fromPlanDate,
      toPlanDate,
      loading = false,
      leaveDetailsData,
      setHasValidationErrors,
    }: ApplyLeaveProps,
    ref: ForwardedRef<FormRef>
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(ApplyLeaveFormSchema),
      mode: "all",
    });

    const {
      watch,
      control,
      setValue,
      setError,
      clearErrors,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    const theme = useTheme();

    const { slate, butterflyBlue, red, lipstickRed, darkOrange } =
      theme.palette.app.color;

    useEnableDisableButton({ control, defaultValues, errors });

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const formValues = watch();

    const fromDate = watch("from_date");

    const toDate = watch("to_date");

    const fromDateISO = fromDate ? DateTime.fromISO(fromDate).toISO() : null;

    const toDateISO = toDate ? DateTime.fromISO(toDate).toISO() : null;

    const fromHalf = watch("from_half");

    const toHalf = watch("to_half");

    const reason = watch("reason");

    const [leave_reason] = useDebounceValue(reason, 1000);

    const currentDate = DateTime.now().toISODate();

    const calculatedFromDate =
      fromDate && fromDate >= toPlanDate
        ? DateTime.fromISO(toPlanDate).plus({ days: 1 }).toISODate()
        : // eslint-disable-next-line sonarjs/no-nested-conditional
          fromDate && fromDate < fromPlanDate
          ? DateTime.fromISO(fromPlanDate).minus({ days: 1 }).toISODate()
          : currentDate;

    const [from_date] = useDebounceValue(
      DateTime.fromISO(calculatedFromDate ?? "").toISODate(),
      Debounce_Delay
    );

    const filterFormValues = filterChangedFormFields(formValues, dirtyFields);

    const isEnabled =
      !!formValues.leave_type_id &&
      !!formValues.from_date &&
      !!formValues.to_date &&
      !!formValues.from_half &&
      !!formValues.to_half &&
      !!leaveDetailsData?.id;

    const {
      data: leaveValidationData,
      isPending,
      error,
    } = useGetLeaveValidation({
      employeeId: leaveDetailsData?.id ?? "",
      leaveRequestId,
      body: {
        leave_type_id: formValues.leave_type_id,
        from_date:
          formValues.from_date &&
          formatDate(formValues.from_date, "yyyy-MM-dd"),
        to_date:
          formValues.to_date && formatDate(formValues.to_date, "yyyy-MM-dd"),
        from_half:
          formValues.from_half === "full_day"
            ? "first_half"
            : formValues.from_half,
        to_half: formValues.to_half,
        attachments: filterFormValues.attachments,
        reason: leave_reason,
      },
      enabled: isEnabled,
    });

    useMemo(() => {
      setHasValidationErrors(
        isPending || !!leaveValidationData?.validationErrors?.length || !!error
      );
    }, [isPending, leaveValidationData?.validationErrors]);

    if (axios.isAxiosError(error) && error?.response?.status === 404) {
      toasts.error({ title: error?.response?.data?.message });
    }

    useEnableDisableButton({
      control,
      defaultValues,
      errors,
    });

    // eslint-disable-next-line sonarjs/cognitive-complexity
    useMemo(() => {
      if (fromDateISO && toDateISO && isEqual(fromDateISO, toDateISO)) {
        if (fromHalf === "first_half") {
          setValue("to_half", "first_half", {
            shouldDirty: true,
          });
        } else if (fromHalf !== "first_half") {
          setValue("to_half", "second_half", {
            shouldDirty: true,
          });
        } else if (
          !fromHalf ||
          (fromHalf === "first_half" && toHalf === "second_half")
        ) {
          setValue("from_half", "full_day", {
            shouldDirty: true,
          });
        }

        if (errors.to_half) {
          clearErrors("to_half");
        }
      } else if (fromDateISO && toDateISO && !isEqual(fromDateISO, toDateISO)) {
        if (!fromHalf || fromHalf === "full_day") {
          setValue("from_half", "first_half", {
            shouldDirty: true,
          });
        }

        if (!toHalf) {
          setValue("to_half", "second_half", {
            shouldDirty: true,
          });
        }
      }
    }, [fromDate, toDate, fromHalf, toHalf]);

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit(() => {
          const payload = {
            ...filterFormValues,
            from_half:
              formValues.from_half === "full_day"
                ? "first_half"
                : filterFormValues.from_half,
          };

          onSubmit(payload);
        })();
      },
      setError,
    }));

    return (
      <Stack gap="16px">
        <FormProvider {...methods}>
          <Stack direction="row" gap="16px">
            <Stack gap="20px" width="65%">
              <Stack
                padding="15px"
                direction="row"
                gap="10px"
                alignItems="center"
                bgcolor={slate[800]}
                borderRadius="5px"
              >
                <Avatar
                  sx={{ height: "50px", width: "50px" }}
                  src={leaveDetailsData && (leaveDetailsData.avatar ?? "")}
                />

                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {leaveDetailsData?.employee_name}
                  </Typography>

                  <Typography variant="subtitle2" color={slate[900]}>
                    {leaveDetailsData?.designation_name}
                  </Typography>
                </Box>
              </Stack>

              <FormRow maxColumn={2}>
                <DatePicker
                  setError={setError}
                  name="from_date"
                  control={control}
                  loading={loading}
                  required
                  label="From Date"
                  maxDate={toDate ? DateTime.fromISO(toDate) : undefined}
                  error={!!errors.from_date}
                  helperText={errorMessages(errors.from_date?.message)}
                />

                <DatePicker
                  setError={setError}
                  name="to_date"
                  control={control}
                  loading={loading}
                  required
                  label="To Date"
                  minDate={fromDate ? DateTime.fromISO(fromDate) : undefined}
                  error={!!errors.to_date}
                  helperText={errorMessages(errors.to_date?.message)}
                />
              </FormRow>

              <LeaveTypePerEmployeeAutocomplete
                name="leave_type_id"
                control={control}
                leavePlanId={leaveDetailsData?.leave_plan_id ?? ""}
                employeeId={leaveDetailsData?.id ?? ""}
                fromDate={from_date ?? ""}
                loading={loading}
                disabled={!fromDate || !toDate}
                required
                error={!!errors.leave_type_id}
                helperText={errorMessages(errors.leave_type_id?.message)}
              />

              {fromDate && toDate && (
                <>
                  <FormRow maxColumn={2}>
                    <Stack>
                      <RadioGroupField
                        name="from_half"
                        label={`From ( ${fromDate && formatDate(fromDate, "DDD")} )`}
                        loading={loading}
                        control={control}
                        options={[
                          ...(isEqual(fromDateISO, toDateISO)
                            ? [
                                {
                                  values: "full_day",
                                  label: "Full day",
                                  disabled: false,
                                },
                              ]
                            : []),
                          {
                            values: "first_half",
                            label: "First half",
                            disabled: false,
                          },
                          {
                            values: "second_half",
                            label: "Second Half",
                            disabled: false,
                          },
                        ]}
                      />

                      <Typography variant="caption" sx={{ color: red[900] }}>
                        {errorMessages(errors.from_half?.message)}
                      </Typography>
                    </Stack>

                    {!isEqual(fromDateISO, toDateISO) && (
                      <Stack>
                        <RadioGroupField
                          name="to_half"
                          label={`To ( ${toDate && formatDate(toDate, "DDD")} )`}
                          control={control}
                          loading={loading}
                          options={[
                            {
                              values: "first_half",
                              label: "First half",
                              disabled: false,
                            },
                            {
                              values: "second_half",
                              label: "Second Half",
                              disabled: false,
                            },
                          ]}
                        />

                        <Typography variant="caption" sx={{ color: red[900] }}>
                          {errorMessages(errors.to_half?.message)}
                        </Typography>
                      </Stack>
                    )}
                  </FormRow>

                  {leaveValidationData && (
                    <Box
                      sx={{
                        backgroundColor: butterflyBlue[500],
                        borderRadius: "5px",
                        padding: "10px",
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {`Leave request is for ${leaveValidationData.totalLeaveDays} Days`}
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              <Stack gap="10px">
                {!!leaveValidationData?.alertNotes?.length && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "5px",
                      backgroundColor: darkOrange[700],
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    {leaveValidationData.alertNotes.map((alert) => (
                      <Stack gap="5px" direction="row" key={uuidv4()}>
                        <Typography variant="body2">
                          {`• ${alert.message}`}
                        </Typography>

                        {alert.type === "attendance" && !!alert.data.length && (
                          <Tooltip
                            toolTipLabel={alert.data
                              .map((date: string) =>
                                DateTime.fromISO(date).toFormat("dd LLL, yyyy")
                              )
                              .join("\n")}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                marginLeft: "5px",
                              }}
                            >
                              View
                            </Typography>
                          </Tooltip>
                        )}
                      </Stack>
                    ))}
                  </Box>
                )}

                {!!leaveValidationData?.validationErrors?.length && (
                  <Box
                    sx={{
                      backgroundColor: lipstickRed[600],
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    {leaveValidationData.validationErrors.map(
                      (error: string) => (
                        <Typography key={uuidv4()} variant="body2">
                          {`• ${error}`}
                        </Typography>
                      )
                    )}
                  </Box>
                )}

                {!!leaveValidationData?.teamRequests?.length && (
                  <Stack gap="10px">
                    <Typography variant="body2" fontWeight={500}>
                      Team-mates on leave during this period
                    </Typography>

                    <PadBox padding={{ paddingLeft: "10px" }}>
                      <Stack direction="row" gap="5px">
                        {leaveValidationData.teamRequests.map(
                          (teamRequest: TeamRequests) => (
                            <Tooltip
                              key={uuidv4()}
                              toolTipLabel={
                                <Stack
                                  direction="column"
                                  padding="5px"
                                  gap="5px"
                                >
                                  <Typography variant="body2" fontWeight={500}>
                                    {teamRequest.gen_full_name}
                                  </Typography>

                                  {teamRequest.leave_dates.map((date) => (
                                    <Typography key={date.id} variant="caption">
                                      {getLeaveDays(
                                        date.from_date,
                                        date.to_date
                                      )}
                                    </Typography>
                                  ))}
                                </Stack>
                              }
                            >
                              <Avatar
                                sx={{ height: "30px", width: "30px" }}
                                src={teamRequest.avatar ?? ""}
                              />
                            </Tooltip>
                          )
                        )}
                      </Stack>
                    </PadBox>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Stack gap="10px" width="35%">
              <Box>
                <FileUploadField
                  name="attachments"
                  label="Attachments"
                  control={control}
                  multiple
                  error={!!errors.attachments}
                  helperText={errorMessages(errors.attachments?.message)}
                />
              </Box>

              <TextField
                label="Leave Remark"
                name="reason"
                control={control}
                loading={loading}
                multiline
                error={!!errors.reason}
                helperText={errorMessages(errors.reason?.message)}
              />

              <EmployeeAutocomplete
                label="Notify To"
                name="notifies"
                isShowAvatar
                isShowSelectAll={false}
                loading={loading}
                control={control}
                multiple
                companyId={leaveDetailsData?.company_id ?? ""}
                error={!!errors.notifies}
                helperText={errorMessages(errors.notifies?.message)}
              />
            </Stack>
          </Stack>
        </FormProvider>
      </Stack>
    );
  }
);

ApplyLeaveForm.displayName = "ApplyLeaveForm";
