import {
  AddAction,
  Button,
  DatePicker,
  DateTimePicker,
  DeleteAction,
  FormRow,
  getTimeInHHmm,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add } from "@mui/icons-material";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import type {
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { dateFormat } from "../../../../../utils/date";
import {
  filterChangedFormFields,
  resetDependentFields,
} from "../../../../../utils/helper";
import type { AttendanceRecord } from "../../../../AttendanceDetails/AttendanceSummary/hooks/type";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import { EmployeeAutocomplete } from "../../../../common/Autocomplete/EmployeeAutoComplete";
import type { AttendanceEmployeeData } from "../AttendanceOverviewList/hooks/useGetAttendanceOverViewEmployees";
import { AttendanceFormShiftDetailsCard } from "./AttendanceFormShiftDetailsCard";
import { checkLogTime, modifyLogTimeInDateTime } from "./hooks/helper";
import type { AttendancePayload, PayloadLogTypes } from "./hooks/type";
import { useGetAttendanceLogs } from "./hooks/useGetAttendanceLogs";

const LogSchema = z
  .object({
    id: z.string().uuid().optional(),
    action: z.string().optional(),
    in_time: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, { message: "common.required" }),
    out_time: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, { message: "common.required" }),
  })
  .superRefine((data, ctx) => {
    if (data.in_time && data.out_time && data.in_time > data.out_time) {
      // Check if in_time is after out_time
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["in_time"],
        message: "'In Time' must be earlier than 'Out Time'.",
      });
    }
  });

const LogTypeSchema = z
  .object({
    manual: z.array(LogSchema),
    machine: z.array(LogSchema),
  })
  .superRefine((data, ctx) => {
    if (data.manual) {
      data.manual.forEach((log, i) => {
        const logIn = log?.in_time;

        // Check if previous log's out_time is before current log's in_time
        if (i > 0) {
          const previousLogOut = data.manual[i - 1]?.out_time;

          if (logIn && previousLogOut && previousLogOut > logIn) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["manual", i, "in_time"],
              message: "'In Time' must be later than previous 'Out Time'.",
            });
          }
        }
      });
    }

    if (data.machine) {
      data.machine.forEach((log, i) => {
        const logIn = log?.in_time;

        // Check if previous log's out_time is before current log's in_time
        if (i > 0) {
          const previousLogOut = data.machine[i - 1]?.out_time;

          if (logIn && previousLogOut && previousLogOut > logIn) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["machine", i, "in_time"],
              message: "'In Time' must be later than previous 'Out Time'.",
            });
          }
        }
      });
    }
  });

const AttendanceFormSchema = z
  .object({
    company_id: z.string().nullable(),
    employee_id: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    current_date: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    attendanceLogs: LogTypeSchema,
    slot_start: z.string().optional().nullable(),
    slot_end: z.string().optional().nullable(),
    shift_type: z.string().nullable(),
    remark: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    // condition for Dynamic company_id
    if (!data.employee_id) {
      if (!data.company_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["company_id"],
          message: "common.required",
        });
      }
    }

    // check enter date is valid in attendance
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const validateDate = (logDate: string, path: (string | number)[]) => {
      if (!data.current_date) {
        return;
      }

      const date = DateTime.fromISO(logDate);

      const currentDate = DateTime.fromISO(data.current_date);

      const minDate = currentDate.minus({ days: 0 });

      const maxDate = currentDate.plus({ days: 2 });

      // Error for Valid date min max
      if (date < minDate || date >= maxDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path,
          message: "Enter or choose a valid date and time.",
        });
      }

      if (data.shift_type == "auto") {
        if (data.slot_start && data.slot_end) {
          const isValid = logDate < data.slot_start || data.slot_end < logDate;

          if (data.slot_start && data.slot_end && isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path,
              message: `Time must be between ${getTimeInHHmm(data.slot_start)} and ${getTimeInHHmm(data.slot_end)}.`,
            });
          }
        }
      }

      if (data.slot_start && data.slot_end) {
        const isValid = logDate < data.slot_start || data.slot_end < logDate;

        if (data.slot_start && data.slot_end && isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path,
            message: `Time must be between ${getTimeInHHmm(data.slot_start)} and ${getTimeInHHmm(data.slot_end)} (next day).`,
          });
        }
      }
    };

    // check  attendance common loop
    const validateAttendanceLogs = (
      logs: PayloadLogTypes[],
      logType: "manual" | "machine"
    ) => {
      // eslint-disable-next-line sonarjs/cognitive-complexity
      logs.forEach((log, i) => {
        if (data.shift_type === "auto") {
          if (log.in_time && i > 0) {
            validateDate(log.in_time, [
              "attendanceLogs",
              logType,
              i,
              "in_time",
            ]);
          }
        } else if (log.in_time) {
          validateDate(log.in_time, ["attendanceLogs", logType, i, "in_time"]);
        }

        if (log.out_time) {
          validateDate(log.out_time, [
            "attendanceLogs",
            logType,
            i,
            "out_time",
          ]);
        }
      });
    };

    if (data.attendanceLogs.manual) {
      return validateAttendanceLogs(data.attendanceLogs.manual, "manual");
    }

    if (data.attendanceLogs.machine) {
      return validateAttendanceLogs(data.attendanceLogs.machine, "machine");
    }
  });

export type AttendanceFormFieldValues = z.infer<typeof AttendanceFormSchema>;

type AttendanceFormProps = {
  defaultValues?: Partial<AttendanceEmployeeData>;
  employeeId?: string;
  currentAttendance?: AttendanceRecord;
  joiningData: string;
};

const currentDate = DateTime.now().toISODate();

const formDefaultValues: AttendanceFormFieldValues = {
  company_id: null,
  employee_id: null,
  current_date: currentDate,
  remark: null,
  attendanceLogs: { manual: [], machine: [] },
  slot_start: null,
  slot_end: null,
  shift_type: null,
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: AttendanceEmployeeData | AttendancePayload) => void
  ) => void;
  setError: UseFormSetError<AttendanceFormFieldValues>;
  setValue: UseFormSetValue<AttendanceFormFieldValues>;
  clearErrors: UseFormClearErrors<AttendanceFormFieldValues>;
};

type DeleteData = {
  id: string;
  action: string;
};

type DeleteTypeProps = {
  manual?: DeleteData[];
  machine?: DeleteData[];
};

type LogType = "attendanceLogs.manual" | "attendanceLogs.machine";

export const AttendanceForm = forwardRef(
  (
    { employeeId, currentAttendance, joiningData }: AttendanceFormProps,
    ref: ForwardedRef<FormRef>
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const [deleteData, setDeleteData] = useState<DeleteTypeProps>();

    const {
      watch,
      setError,
      reset,
      clearErrors,
      setValue,
      formState: { errors, dirtyFields },
      handleSubmit,
      control,
    } = useForm<AttendanceFormFieldValues>({
      defaultValues: {
        ...formDefaultValues,
        employee_id: employeeId ?? null,
      },
      resolver: zodResolver(AttendanceFormSchema),
      mode: "all",
    });

    const formData = useWatch({ control });

    const theme = useTheme();

    const { butterflyBlue } = theme.palette.app.color;

    const companyId = watch("company_id") ?? "";

    const selectedEmployeeId = watch("employee_id") ?? "";

    const date = watch("current_date") ?? "";

    const attendanceLogs = watch("attendanceLogs");

    const { data, isFetching } = useGetAttendanceLogs({
      selectedEmployeeId,
      date,
    });

    const referenceDate = date ?? "";

    const modifyAutoShiftTime =
      data.auto_shifts &&
      modifyLogTimeInDateTime(data.auto_shifts, referenceDate);

    const firstLogInData = attendanceLogs?.manual[0]?.in_time;

    const autoAssignData =
      modifyAutoShiftTime && firstLogInData
        ? checkLogTime(firstLogInData, modifyAutoShiftTime)
        : null;

    // check day shift or night shit time
    const dayNightShift =
      getTimeInHHmm(data.shift_start) < getTimeInHHmm(data.shift_end);

    const shiftStart = DateTime.fromISO(`${date}T${data.slot_start}`, {
      zone: "utc",
    })
      .minus({ day: dayNightShift ? 1 : 0 })
      .toISO();

    const shiftEnd = DateTime.fromISO(`${date}T${data.slot_end}`, {
      zone: "utc",
    })
      .plus({ day: dayNightShift ? 0 : 1 })
      .set({ second: 0, millisecond: 0 })
      .toISO();

    const slotStartTime =
      data.shift_type === "auto"
        ? (autoAssignData?.slot_start ?? shiftStart)
        : shiftStart;

    const slotEndTime =
      data.shift_type === "auto"
        ? (autoAssignData?.slot_end ?? shiftEnd)
        : shiftEnd;

    const initialData = useMemo(() => {
      return {
        ...formDefaultValues,
        employee_id: employeeId ?? null,
        attendanceLogs: data.logs ?? {
          manual: [],
          machine: [],
        },
        slot_start: slotStartTime,
        slot_end: slotEndTime,
        current_date: currentAttendance?.date ?? currentDate,
      };
    }, [formDefaultValues, employeeId, data]);

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          const mergedData = {
            manual: [...attendanceLogs.manual, ...(deleteData?.manual ?? [])],
            machine: [
              ...attendanceLogs.machine,
              ...(deleteData?.machine ?? []),
            ],
          };

          const filteredLogs = {
            manual: mergedData.manual.filter(
              // eslint-disable-next-line sonarjs/no-nested-functions
              (log) => "action" in log
            ),
            machine: mergedData.machine.filter(
              // eslint-disable-next-line sonarjs/no-nested-functions
              (log) => "action" in log
            ),
          };

          const payloadData: AttendancePayload = {
            employee_id: formValues.employee_id,
            shift_type_id: data.shift_type_id,
            date: formValues.current_date,
            logs: filteredLogs,
            remark: filterFormValues.remark,
          };

          onSubmit(payloadData);
        })();
      },
      setError,
      setValue,
      clearErrors,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const handleAddFirstLog = () => {
      // manage shift_start i 0 to 24 hours in day and night shift
      const localOffset = DateTime.now().offset;

      const LocalTimeOffsetHours = 24 - localOffset / 60;

      const shiftEndUTCTime = DateTime.fromISO(data.shift_end, { zone: "utc" });

      // Convert to hour format
      const shiftEndHours =
        shiftEndUTCTime.hour +
        shiftEndUTCTime.minute / 60 +
        shiftEndUTCTime.second / 3600;

      const shiftStartTime = DateTime.fromISO(`${date}T${data.shift_start}`, {
        zone: "utc",
      }).toISO();

      const checkShiftType = dayNightShift ? 0 : 1;

      const shiftEndTime = DateTime.fromISO(`${date}T${data.shift_end}`, {
        zone: "utc",
      })
        .plus({
          day: shiftEndHours < LocalTimeOffsetHours ? checkShiftType : 0,
        })
        .toISO();

      const newLog = {
        action: "add",
        in_time: shiftStartTime,
        out_time: shiftEndTime,
      };

      const manualLogs = attendanceLogs.manual ?? [];

      const updatedLogs = [...manualLogs, newLog];

      setValue("attendanceLogs.manual", updatedLogs, { shouldDirty: true });
    };

    // eslint-disable-next-line sonarjs/cognitive-complexity
    const handleAddLog = (index: number, position: "up" | "bottom") => {
      let manageInTime, manageOutTime;

      // manage slot value in adding up
      if (position === "up") {
        if (index > 0) {
          manageInTime = attendanceLogs.manual[index - 1]?.out_time;
          manageOutTime = attendanceLogs.manual[index]?.in_time;
        }

        if (index === 0) {
          manageInTime = slotStartTime;
          manageOutTime = attendanceLogs.manual[index]?.in_time;
        }
      }

      // manage slot value in adding bottom
      if (position === "bottom") {
        if (index === 0 && attendanceLogs.manual.length === 1) {
          manageInTime = attendanceLogs.manual[index]?.out_time;
          manageOutTime = slotEndTime;
        }

        if (index >= 0 && attendanceLogs.manual.length > 1) {
          manageInTime = attendanceLogs.manual[index]?.out_time;
          manageOutTime =
            attendanceLogs.manual[index + 1]?.in_time ?? slotEndTime;
        }
      }

      const newLog = {
        action: "add",
        in_time: manageInTime,
        out_time: manageOutTime,
      };

      const manualLogs = attendanceLogs.manual;

      // setting up postions on log input according to button
      const updatedLogs =
        position === "up"
          ? [...manualLogs.slice(0, index), newLog, ...manualLogs.slice(index)]
          : [
              ...manualLogs.slice(0, index + 1),
              newLog,
              ...manualLogs.slice(index + 1),
            ];

      setValue("attendanceLogs.manual", updatedLogs, { shouldDirty: true });
    };

    const handleRemoveLog = (
      logType: "manual" | "machine",
      id?: string,
      index?: number
    ) => {
      if (id) {
        const updatedLogs = attendanceLogs[logType].filter(
          (logs) => logs.id !== id
        );

        setValue(`attendanceLogs.${logType}`, updatedLogs, {
          shouldDirty: true,
        });

        setDeleteData((prevData) => ({
          ...prevData,
          [logType]: [...(prevData?.[logType] || []), { id, action: "delete" }],
        }));
      } else {
        const updatedLogs = attendanceLogs?.manual.filter(
          (_, i) => i !== index
        );

        setValue("attendanceLogs.manual", updatedLogs, { shouldDirty: true });
      }
      clearErrors();
    };

    const showEmployeeError =
      (companyId && errorMessages(errors.employee_id?.message)) ?? undefined;

    const showDateError =
      (selectedEmployeeId && errorMessages(errors.current_date?.message)) ??
      undefined;

    const handleLogInDate = (dateTime: DateTime) => {
      if (!date || !dateTime) {
        return false;
      }

      const currentDate = DateTime.fromISO(date);

      const isGreaterThanCurrentDate =
        currentDate > dateTime || currentDate.plus({ day: 1 }) < dateTime;

      return isGreaterThanCurrentDate;
    };

    const calendarOpeningDate = useMemo(() => {
      return date ? DateTime.fromISO(date) : DateTime.fromISO("");
    }, [date]);

    const dependentFieldsMap: Partial<
      Record<
        keyof AttendanceFormFieldValues,
        (keyof AttendanceFormFieldValues)[]
      >
    > = {
      company_id: ["employee_id"],
    };

    useMemo(() => {
      if (!employeeId) {
        resetDependentFields({
          fieldName: "company_id",
          fieldValue: companyId,
          dirtyFields,
          setValue,
          dependentFieldsMap,
        });
      }
    }, [companyId]);

    useMemo(() => {
      if (selectedEmployeeId && date) {
        if (data) {
          setValue("attendanceLogs", data.logs ?? { manual: [], machine: [] }, {
            shouldDirty: true,
          });
        }
        clearErrors("attendanceLogs");
      } else {
        setValue(
          "attendanceLogs",
          { manual: [], machine: [] },
          { shouldDirty: true }
        );
      }
    }, [data]);

    useMemo(() => {
      if (currentAttendance?.date) {
        setValue("current_date", currentAttendance.date);
      }
    }, [currentAttendance]);

    useMemo(() => {
      if (!companyId && !employeeId) {
        reset();
      }

      if (!selectedEmployeeId || !date) {
        setValue(
          "attendanceLogs",
          { manual: [], machine: [] },
          { shouldDirty: true }
        );
        clearErrors("attendanceLogs");
      }
    }, [companyId, selectedEmployeeId, date]);

    const errorLogs = (logs: PayloadLogTypes[], logType: LogType) => {
      logs.forEach((log, i) => {
        const logIn = log.in_time;

        const logOut = log.out_time;

        const previousLogOut = i > 0 && logs[i - 1]?.out_time;

        if (logIn && logOut && logIn > logOut) {
          setError(`${logType}.${i}.in_time`, {
            type: "custom",
            message: "'In Time' must be earlier than 'Out Time'.",
          });
        } else {
          clearErrors(`${logType}.${i}.in_time`);
        }

        if (previousLogOut && logIn && previousLogOut > logIn) {
          setError(`${logType}.${i}.in_time`, {
            type: "custom",
            message: "'In Time' must be later than previous 'Out Time'.",
          });
        }

        if (logType === "attendanceLogs.machine") {
          if (!logIn) {
            setError(`attendanceLogs.machine.${i}.in_time`, {
              type: "custom",
              message: "In Time is Missing",
            });
          }

          if (!logOut) {
            setError(`attendanceLogs.machine.${i}.out_time`, {
              type: "custom",
              message: "Out Time is Missing",
            });
          }
        }
      });
    };

    useMemo(() => {
      if (data && attendanceLogs) {
        errorLogs(attendanceLogs?.manual, "attendanceLogs.manual");

        attendanceLogs.manual.forEach((log, index) => {
          if (log.action !== "add") {
            if (
              (data.logs?.manual[index]?.in_time !== log.in_time ||
                data.logs.manual[index]?.out_time !== log.out_time) &&
              log.action !== "delete"
            ) {
              attendanceLogs.manual[index] = {
                ...log,
                action: "update",
              };
            }
          }
        });

        if (attendanceLogs.machine) {
          errorLogs(attendanceLogs.machine, "attendanceLogs.machine");

          attendanceLogs.machine.forEach((log, index) => {
            if (log.action !== "add") {
              if (
                (data.logs.machine[index]?.in_time !== log.in_time ||
                  data.logs.machine[index]?.out_time !== log.out_time) &&
                log.action !== "delete"
              ) {
                attendanceLogs.machine[index] = {
                  ...log,
                  action: "update",
                };
              }
            }
          });
        }

        if (!attendanceLogs.machine || !attendanceLogs.manual) {
          clearErrors("attendanceLogs");
        }
      }
    }, [formData]);

    useMemo(() => {
      if (slotStartTime && slotEndTime) {
        setValue("slot_start", slotStartTime);
        setValue("slot_end", slotEndTime);
      }

      if (data.shift_type) {
        setValue("shift_type", data.shift_type);
      }
    }, [data, slotStartTime, slotEndTime]);

    useEnableDisableButton({
      control,
      defaultValues: initialData,
      errors,
    });

    return (
      <Stack gap="10px">
        <FormRow maxColumn={2}>
          {!employeeId && (
            <CompanyAutocomplete
              name="company_id"
              control={control}
              error={!!errors.company_id}
              helperText={errorMessages(errors.company_id?.message)}
              required
            />
          )}

          {!employeeId && (
            <EmployeeAutocomplete
              name="employee_id"
              control={control}
              companyId={companyId}
              disabled={!companyId}
              showAvatar
              error={!!errors.employee_id}
              helperText={showEmployeeError}
              required
            />
          )}

          {currentAttendance?.date ? (
            <Typography variant="h6">{`${dateFormat(currentAttendance.date, true)}, (${DateTime.fromISO(currentAttendance.date).toFormat("cccc")})`}</Typography>
          ) : (
            <DatePicker
              name="current_date"
              control={control}
              label="Date"
              required
              disabled={!selectedEmployeeId}
              error={!!errors.current_date}
              helperText={showDateError}
              maxDate={DateTime.now().endOf("month")}
              minDate={DateTime.fromISO(joiningData)}
            />
          )}
        </FormRow>

        <AttendanceFormShiftDetailsCard
          data={data}
          isFetching={isFetching}
          autoAssignData={autoAssignData ?? null}
          shiftType={data.shift_type}
        />

        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: butterflyBlue[900],
            }}
          >
            Time Log Adjustment
          </Typography>

          {!attendanceLogs?.manual.length && (
            <Button
              variant="outlined"
              onClick={handleAddFirstLog}
              disabled={!selectedEmployeeId}
            >
              <Add /> Add Logs
            </Button>
          )}
        </Stack>
        {attendanceLogs?.manual.map((log, index) => {
          return (
            // eslint-disable-next-line sonarjs/no-array-index-key
            <Stack flexDirection="row" gap="10px" key={index}>
              <AddAction
                onClick={() => handleAddLog(index, "up")}
                sx={{ height: "30px", marginTop: "38px" }}
              />
              <DateTimePicker
                name={`attendanceLogs.manual.${index}.in_time`}
                control={control}
                label="In Time"
                error={!!errors.attendanceLogs?.manual?.[index]?.in_time}
                helperText={errorMessages(
                  errors.attendanceLogs?.manual?.[index]?.in_time?.message
                )}
                shouldDisableDate={handleLogInDate}
                loading={isFetching}
                maxDate={calendarOpeningDate.endOf("month")}
              />

              <RemoveRoundedIcon sx={{ marginTop: "38px" }} />

              <DateTimePicker
                name={`attendanceLogs.manual.${index}.out_time`}
                control={control}
                label="Out Time"
                error={!!errors.attendanceLogs?.manual?.[index]?.out_time}
                helperText={errorMessages(
                  errors.attendanceLogs?.manual?.[index]?.out_time?.message
                )}
                shouldDisableDate={handleLogInDate}
                loading={isFetching}
                maxDate={calendarOpeningDate.endOf("month")}
              />
              <AddAction
                onClick={() => handleAddLog(index, "bottom")}
                sx={{ height: "30px", marginTop: "38px" }}
              />

              <DeleteAction
                onClick={() => handleRemoveLog("manual", log?.id, index)}
                sx={{ height: "30px", marginTop: "38px" }}
              />
            </Stack>
          );
        })}
        <Typography
          variant="subtitle1"
          sx={{
            color: butterflyBlue[900],
          }}
        >
          Device Log Adjustment
        </Typography>
        {attendanceLogs?.machine.map((log, index) => {
          return (
            // eslint-disable-next-line sonarjs/no-array-index-key
            <Stack flexDirection="row" gap="10px" key={index}>
              <DateTimePicker
                name={`attendanceLogs.machine.${index}.in_time`}
                control={control}
                label="In Time"
                error={!!errors.attendanceLogs?.machine?.[index]?.in_time}
                helperText={errorMessages(
                  errors.attendanceLogs?.machine?.[index]?.in_time?.message
                )}
                shouldDisableDate={handleLogInDate}
                loading={isFetching}
                maxDate={calendarOpeningDate.endOf("month")}
              />

              <RemoveRoundedIcon sx={{ marginTop: "38px" }} />

              <DateTimePicker
                name={`attendanceLogs.machine.${index}.out_time`}
                control={control}
                label="Out Time"
                error={!!errors.attendanceLogs?.machine?.[index]?.out_time}
                helperText={errorMessages(
                  errors.attendanceLogs?.machine?.[index]?.out_time?.message
                )}
                shouldDisableDate={handleLogInDate}
                loading={isFetching}
                maxDate={calendarOpeningDate.endOf("month")}
              />

              <DeleteAction
                onClick={() => handleRemoveLog("machine", log.id)}
                sx={{ height: "30px", marginTop: "38px" }}
              />
            </Stack>
          );
        })}
        <TextField control={control} label="Remark" name="remark" fullWidth />
      </Stack>
    );
  }
);

AttendanceForm.displayName = "AttendanceForm";
