/* eslint-disable sonarjs/cognitive-complexity */
import {
  Button,
  DeleteAction,
  getTimeInHHmm,
  PadBox,
  TextField,
  TimePicker,
} from "@codezee/sixtify-brahma";
import {
  Box,
  Divider,
  InputLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { isEmpty, isNull, some } from "lodash";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  getTimeDifference,
  getTimeHhMmSs,
  isValidTime,
} from "../../../../../../../utils/date";
import { calculateNetWorkingHours } from "../../FixedShift/AddFixedShift/FixedShiftTimingRow";
import {
  handleTwentyFourHoursTime,
  modifyTimeInDateTime,
} from "../hooks/helper";
import type { AutoShiftFormFieldValues, AutoShiftTypes } from "./AutoShiftForm";

const Headers = [
  "Shift Name",
  "First Clock In Window",
  "Shift Time Window",
  "Break Time Window",
  "Effective Work Hours",
  "Slot Duration",
];

export const autoShiftAssignmentSchema = z
  .object({
    id: z.string().optional(),
    action: z.string().optional(),
    auto_shift_type_name: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    shift_start: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    shift_end: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    shift_hours: z.string().nullable().optional(),
    break_start: z
      .string()
      .nullable()
      .optional()
      .refine(
        (value) => {
          if (!value) {
            return true;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      )
      .optional(),
    break_end: z
      .string()
      .nullable()
      .optional()
      .refine(
        (value) => {
          if (!value) {
            return true;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      )
      .optional(),
    break_hours: z.string().nullable().optional(),
    clock_in_start: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    clock_in_end: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    slot_start: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    slot_end: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, {
        message: "common.required",
      }),
  })
  .superRefine((data, ctx) => {
    if (data) {
      const clockStartInHhMm =
        data.clock_in_start && getTimeInHHmm(data.clock_in_start);

      const clockEndInHhMm =
        data.clock_in_end && getTimeInHHmm(data.clock_in_end);

      const breakStartInHhMm =
        data.break_start && getTimeInHHmm(data.break_start);

      const breakEndInHhMm = data.break_end && getTimeInHHmm(data.break_end);

      //  clock in and out minutes
      if (
        clockStartInHhMm &&
        clockEndInHhMm &&
        clockStartInHhMm === clockEndInHhMm
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["clock_in_start"],
          message: "From time must be later than the previous 'To' time.",
        });
      }

      if (breakStartInHhMm && !breakEndInHhMm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["break_end"],
          message:
            "Break end time is required when break start time is provided",
        });
      }
    }
  });

export type AutoShiftAssignmentFormProps = {
  defaultValues?: AutoShiftFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
  isEdit?: boolean;
  setDeletedAutoShiftTimingsId: (ids: AutoShiftTypes[]) => void;
  deletedAutoShiftTimingsId?: AutoShiftTypes[];
};

export const AutoShiftAssignmentForm = ({
  loading,
  disabled = false,
  isEdit = false,
  setDeletedAutoShiftTimingsId,
  deletedAutoShiftTimingsId,
}: AutoShiftAssignmentFormProps) => {
  const { t } = useTranslation();

  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const {
    watch,
    control,
    clearErrors,
    formState: { errors },
    setValue,
    resetField,
    setError,
  } = useFormContext<AutoShiftFormFieldValues>();

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const currentDate = DateTime.now().toFormat("yyyy-MM-dd");

  const formData = watch("auto_shift_timings");

  const covertTimeToDateTime = modifyTimeInDateTime(formData, currentDate);

  const isFirstClockTimeIn24Hours =
    handleTwentyFourHoursTime(covertTimeToDateTime);

  useEffect(() => {
    formData?.forEach((item, index) => {
      const clockStartInHhMm =
        (item.clock_in_start && getTimeInHHmm(item.clock_in_start)) ?? "";

      const clockEndInHhMm =
        (item.clock_in_end && getTimeInHHmm(item.clock_in_end)) ?? "";

      const shiftStartInHhMm =
        (item.shift_start && getTimeInHHmm(item.shift_start)) ?? "";

      const shiftEndInHhMm =
        (item.shift_end && getTimeInHHmm(item.shift_end)) ?? "";

      const breakStartInHhMm =
        (item.break_start && getTimeInHHmm(item.break_start)) ?? "";

      const breakEndInHhMm =
        (item.break_end && getTimeInHHmm(item.break_end)) ?? "";

      const slotEndInHhMm =
        (item.slot_end && getTimeInHHmm(item.slot_end)) ?? "";

      if (isEdit) {
        if (
          !isValidTime(item.shift_start ?? "") &&
          !isValidTime(item.shift_end ?? "")
        ) {
          resetField(`auto_shift_timings.${index}.break_start`, {
            defaultValue: null,
          });
          resetField(`auto_shift_timings.${index}.break_end`, {
            defaultValue: null,
          });
        }
      }

      if (isFirstClockTimeIn24Hours && clockStartInHhMm) {
        setError(`auto_shift_timings.${formData.length - 1}.clock_in_start`, {
          type: "custom",
          message: "First Clock Time should be in 24 hours",
        });
      } else {
        clearErrors(`auto_shift_timings.${formData.length - 1}.clock_in_start`);
      }

      if (isFirstClockTimeIn24Hours && clockEndInHhMm) {
        setError(`auto_shift_timings.${formData.length - 1}.clock_in_end`, {
          type: "custom",
          message: "First Clock Time should be in 24 hours",
        });
      } else {
        clearErrors(`auto_shift_timings.${formData.length - 1}.clock_in_end`);
      }

      if (
        clockStartInHhMm &&
        clockEndInHhMm &&
        clockStartInHhMm === clockEndInHhMm
      ) {
        setError(`auto_shift_timings.${index}.clock_in_start`, {
          type: "custom",
          message: "From time must be later than the previous 'To' time.",
        });
      } else {
        clearErrors(`auto_shift_timings.${index}.clock_in_start`);
      }

      if (clockStartInHhMm < shiftEndInHhMm) {
        if (clockStartInHhMm && slotEndInHhMm && shiftEndInHhMm) {
          const isShiftRange =
            slotEndInHhMm >= clockStartInHhMm &&
            slotEndInHhMm <= shiftEndInHhMm;

          if (isShiftRange) {
            setError(`auto_shift_timings.${index}.slot_end`, {
              type: "custom",
              message:
                "Slot end time must be greater than slot start time and less than shift end time",
            });
          } else {
            clearErrors(`auto_shift_timings.${index}.slot_end`);
          }
        }
      } else if (clockStartInHhMm && slotEndInHhMm && shiftEndInHhMm) {
        const isShiftRange =
          slotEndInHhMm < clockStartInHhMm && slotEndInHhMm > shiftEndInHhMm;

        if (!isShiftRange) {
          setError(`auto_shift_timings.${index}.slot_end`, {
            type: "custom",
            message:
              "Slot end time must be greater than slot start time and less than shift end time",
          });
        } else {
          clearErrors(`auto_shift_timings.${index}.slot_end`);
        }
      }

      if (clockStartInHhMm < clockEndInHhMm) {
        if (
          (shiftStartInHhMm && clockStartInHhMm > shiftStartInHhMm) ||
          (shiftStartInHhMm > clockEndInHhMm && shiftStartInHhMm)
        ) {
          setError(`auto_shift_timings.${index}.shift_start`, {
            type: "custom",
            message: "Shift start time must fall within the Clock-in window.",
          });
        } else {
          clearErrors(`auto_shift_timings.${index}.shift_start`);
        }
      } else if (
        clockStartInHhMm > shiftStartInHhMm &&
        shiftStartInHhMm > clockEndInHhMm &&
        shiftStartInHhMm
      ) {
        setError(`auto_shift_timings.${index}.shift_start`, {
          type: "custom",
          message: "Shift start time must fall within the Clock-in window.",
        });
      } else {
        clearErrors(`auto_shift_timings.${index}.shift_start`);
      }

      //  break start
      if (shiftStartInHhMm < shiftEndInHhMm) {
        if (
          (breakStartInHhMm && shiftStartInHhMm > breakStartInHhMm) ||
          (breakStartInHhMm > shiftEndInHhMm && breakStartInHhMm)
        ) {
          setError(`auto_shift_timings.${index}.break_start`, {
            type: "custom",
            message: "Shift start time must fall within the Clock-in window.",
          });
        } else {
          clearErrors(`auto_shift_timings.${index}.break_start`);
        }
      } else if (
        shiftStartInHhMm > breakStartInHhMm &&
        breakStartInHhMm > shiftEndInHhMm
      ) {
        setError(`auto_shift_timings.${index}.break_start`, {
          type: "custom",
          message: "Shift start time must fall within the Clock-in window.",
        });
      } else {
        clearErrors(`auto_shift_timings.${index}.break_start`);
      }

      //  break end

      if (breakStartInHhMm && !breakEndInHhMm) {
        setError(`auto_shift_timings.${index}.break_end`, {
          type: "custom",
          message:
            "Break end time is required when break start time is provided",
        });
      } else {
        clearErrors(`auto_shift_timings.${index}.break_end`);
      }

      if (shiftStartInHhMm < shiftEndInHhMm) {
        if (shiftEndInHhMm && breakStartInHhMm && breakEndInHhMm) {
          const isBreakEndInRange =
            breakEndInHhMm > breakStartInHhMm &&
            breakEndInHhMm < shiftEndInHhMm;

          if (!isBreakEndInRange) {
            setError(`auto_shift_timings.${index}.break_end`, {
              type: "custom",
              message:
                "Break to time must be after 'Break From' and before 'Shift To' time",
            });
          } else {
            clearErrors(`auto_shift_timings.${index}.break_end`);
          }
        }
      } else if (shiftEndInHhMm && breakStartInHhMm && breakEndInHhMm) {
        const isBreakEndInRange =
          breakEndInHhMm < breakStartInHhMm && breakEndInHhMm > shiftEndInHhMm;

        if (isBreakEndInRange) {
          setError(`auto_shift_timings.${index}.break_end`, {
            type: "custom",
            message:
              "Break to time must be after 'Break From' and before 'Shift To' time",
          });
        } else {
          clearErrors(`auto_shift_timings.${index}.break_end`);
        }
      }

      if (index > 0) {
        const previousValue = formData[index - 1];

        const previousClockInEndInHhMm =
          previousValue?.clock_in_end &&
          getTimeInHHmm(previousValue?.clock_in_end);

        if (
          shiftStartInHhMm &&
          shiftEndInHhMm &&
          previousClockInEndInHhMm &&
          clockStartInHhMm &&
          previousClockInEndInHhMm >= clockStartInHhMm
        ) {
          setError(`auto_shift_timings.${index}.clock_in_start`, {
            type: "custom",
            message: "From time must be later than the previous 'To' time",
          });
        } else {
          clearErrors(`auto_shift_timings.${index}.clock_in_start`);
        }
      }

      const clockInStartTime = watch(
        `auto_shift_timings.${index}.clock_in_start`
      );

      const shiftHours =
        item.shift_end &&
        item.shift_start &&
        getTimeHhMmSs({
          start: item.shift_start,
          end: item.shift_end,
        });

      const breakHours =
        item.break_start &&
        item.break_end &&
        getTimeHhMmSs({
          start: item.break_start ?? "",
          end: item.break_end ?? "",
        });

      setValue(`auto_shift_timings.${index}.slot_start`, clockInStartTime);

      clearErrors(`auto_shift_timings.${index}.slot_start`);

      if (item.shift_start && item.shift_end) {
        setValue(`auto_shift_timings.${index}.shift_hours`, shiftHours);
      }

      if (item.break_start && item.break_end) {
        setValue(`auto_shift_timings.${index}.break_hours`, breakHours);
      }

      if (!isValidTime(item.break_start ?? "")) {
        setValue(`auto_shift_timings.${index}.break_hours`, null);
      }

      if (
        (!item.break_start?.length && item.break_end) ||
        !item.shift_start ||
        !item.shift_end
      ) {
        resetField(`auto_shift_timings.${index}.break_end`);
        resetField(`auto_shift_timings.${index}.break_hours`);
        resetField(`auto_shift_timings.${index}.break_start`);
      }
    });
  }, [JSON.stringify(formData)]);

  const hasValidShiftEntries = useMemo(() => {
    return isEmpty(
      formData.filter((item) =>
        some(
          [
            item.shift_start,
            item.shift_end,
            item.auto_shift_type_name,
            item.clock_in_start,
            item.clock_in_end,
            item.slot_end,
          ],
          isNull
        )
      )
    );
  }, [JSON.stringify(formData)]);

  const { append, fields, remove } = useFieldArray({
    control,
    name: "auto_shift_timings",
    keyName: "arrayId",
  });

  const defaultRow = {
    auto_shift_type_name: null,
    shift_start: null,
    shift_end: null,
    shift_hours: null,
    break_start: null,
    break_end: null,
    break_hours: null,
    clock_in_start: null,
    clock_in_end: null,
    slot_start: null,
    slot_end: null,
  };

  if (!fields || fields.length === 0) {
    append({ ...defaultRow });
  }

  const handleAddNewRow = () => {
    if (formData) {
      const updatedOTcriteria = [
        ...formData,
        {
          ...(isEdit && { action: "add" }),
          ...defaultRow,
        },
      ];

      setValue("auto_shift_timings", updatedOTcriteria);
    }
  };

  const handleRemoveRow = (index: number) => {
    remove(index);
  };

  const autoShiftTimingTracker = (index: number) => {
    const shiftStart = watch(`auto_shift_timings.${index}.shift_start`) ?? "";

    const shiftEnd = watch(`auto_shift_timings.${index}.shift_end`) ?? "";

    const breakStart = watch(`auto_shift_timings.${index}.break_start`) ?? "";

    const breakEnd = watch(`auto_shift_timings.${index}.break_end`) ?? "";

    const shiftHours = getTimeDifference({
      start: shiftStart,
      end: shiftEnd,
    }).textFormat;

    const breakHours = getTimeDifference({
      start: breakStart,
      end: breakEnd,
    }).textFormat;

    return {
      shiftStart,
      shiftEnd,
      breakStart,
      breakEnd,
      shiftHours,
      breakHours,
    };
  };

  return (
    <Stack>
      <TableContainer sx={{ overflow: "auto" }}>
        <Table sx={{ marginBottom: 2 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: slate[700] }}>
              {Headers.map((item) => (
                <TableCell
                  key={uuidv4()}
                  sx={{
                    whiteSpace: "nowrap",
                    padding: "16px 8px",
                  }}
                >
                  {item}
                </TableCell>
              ))}

              <TableCell
                sx={{
                  position: "sticky",
                  right: 0,
                  backgroundColor: slate[700],
                  zIndex: 2,
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.map((field, index) => {
              const {
                shiftStart,
                shiftEnd,
                breakStart,
                breakEnd,
                shiftHours,
                breakHours,
              } = autoShiftTimingTracker(index);

              return (
                <TableRow
                  sx={{ verticalAlign: "baseline" }}
                  key={field.arrayId}
                >
                  <TableCell sx={{ padding: "16px 11px 0px 11px" }}>
                    <Box minWidth="147px">
                      <TextField
                        loading={loading}
                        control={control}
                        name={`auto_shift_timings.${index}.auto_shift_type_name`}
                        label={index === 0 ? "Shift Name" : ""}
                        placeholder="Shift Name"
                        required
                        error={
                          !!errors?.auto_shift_timings?.[index]
                            ?.auto_shift_type_name
                        }
                        helperText={errorMessages(
                          errors?.auto_shift_timings?.[index]
                            ?.auto_shift_type_name?.message
                        )}
                        disabled={disabled}
                      />
                    </Box>
                  </TableCell>

                  <TableCell sx={{ padding: "16px 11px 0px 11px" }}>
                    <Stack direction="row" gap="5px">
                      <Box minWidth="147px">
                        <TimePicker
                          loading={loading}
                          control={control}
                          name={`auto_shift_timings.${index}.clock_in_start`}
                          label={index === 0 ? "From Time" : ""}
                          error={
                            !!errors?.auto_shift_timings?.[index]
                              ?.clock_in_start
                          }
                          helperText={errorMessages(
                            errors?.auto_shift_timings?.[index]?.clock_in_start
                              ?.message
                          )}
                          disabled={disabled}
                        />
                      </Box>

                      <Box minWidth="147px">
                        <TimePicker
                          loading={loading}
                          control={control}
                          name={`auto_shift_timings.${index}.clock_in_end`}
                          label={index === 0 ? "To Time" : ""}
                          error={
                            !!errors?.auto_shift_timings?.[index]?.clock_in_end
                          }
                          helperText={errorMessages(
                            errors?.auto_shift_timings?.[index]?.clock_in_end
                              ?.message
                          )}
                          disabled={disabled}
                        />
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ padding: "16px 11px 0px 11px" }}>
                    <Stack direction="row" gap="5px">
                      <Box minWidth="147px">
                        <TimePicker
                          control={control}
                          loading={loading}
                          name={`auto_shift_timings.${index}.shift_start`}
                          label={index === 0 ? "From Time" : ""}
                          error={
                            !!errors?.auto_shift_timings?.[index]?.shift_start
                          }
                          helperText={errorMessages(
                            errors?.auto_shift_timings?.[index]?.shift_start
                              ?.message
                          )}
                          disabled={disabled}
                        />
                      </Box>

                      <Box minWidth="147px">
                        <TimePicker
                          loading={loading}
                          control={control}
                          name={`auto_shift_timings.${index}.shift_end`}
                          label={index === 0 ? "To Time" : ""}
                          error={
                            !!errors?.auto_shift_timings?.[index]?.shift_end
                          }
                          helperText={errorMessages(
                            errors?.auto_shift_timings?.[index]?.shift_end
                              ?.message
                          )}
                          disabled={disabled}
                        />
                      </Box>

                      <Box minWidth="100px">
                        <Stack direction="column" gap="10px">
                          {index === 0 && <InputLabel>Gross Hours</InputLabel>}

                          <Typography
                            sx={{
                              width: "100%",
                              height: "41.5px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {shiftStart && shiftEnd ? shiftHours : "0h 0m"}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ padding: "16px 11px 0px 11px" }}>
                    <Stack direction="row" gap="5px">
                      <Box minWidth="147px">
                        <TimePicker
                          control={control}
                          loading={loading}
                          name={`auto_shift_timings.${index}.break_start`}
                          label={index === 0 ? "From Time" : ""}
                          error={
                            !!errors?.auto_shift_timings?.[index]?.break_start
                          }
                          helperText={errorMessages(
                            errors?.auto_shift_timings?.[index]?.break_start
                              ?.message
                          )}
                          disabled={!(shiftStart && shiftEnd) || disabled}
                        />
                      </Box>

                      <Box minWidth="147px">
                        <TimePicker
                          loading={loading}
                          control={control}
                          name={`auto_shift_timings.${index}.break_end`}
                          label={index === 0 ? "To Time" : ""}
                          error={
                            !!errors?.auto_shift_timings?.[index]?.break_end
                          }
                          helperText={errorMessages(
                            errors?.auto_shift_timings?.[index]?.break_end
                              ?.message
                          )}
                          disabled={!breakStart || disabled}
                        />
                      </Box>

                      <Box minWidth="100px">
                        <Stack direction="column" gap="10px">
                          {index === 0 && <InputLabel>Gross Hours</InputLabel>}

                          <Typography
                            sx={{
                              width: "100%",
                              height: "41.5px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {breakStart && breakEnd ? breakHours : "0h 0m"}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ padding: "16px 11px 0px 11px" }}>
                    <Box width="100px">
                      <Stack direction="column" gap="10px">
                        {index === 0 && <InputLabel>Work Hours</InputLabel>}

                        <Typography
                          sx={{
                            width: "100%",
                            height: "41.5px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {calculateNetWorkingHours(
                            shiftStart,
                            shiftEnd,
                            breakStart,
                            breakEnd
                          )}
                        </Typography>
                      </Stack>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ padding: "16px 11px 0px 11px" }}>
                    <Stack direction="row" gap="5px">
                      <Box minWidth="147px">
                        <TimePicker
                          loading={loading}
                          name={`auto_shift_timings.${index}.slot_start`}
                          label={index === 0 ? "From Time" : ""}
                          disabled
                          control={control}
                        />
                      </Box>

                      <Box minWidth="147px">
                        <TimePicker
                          loading={loading}
                          control={control}
                          name={`auto_shift_timings.${index}.slot_end`}
                          label={index === 0 ? "To Time" : ""}
                          error={
                            !!errors?.auto_shift_timings?.[index]?.slot_end
                          }
                          helperText={errorMessages(
                            errors?.auto_shift_timings?.[index]?.slot_end
                              ?.message
                          )}
                          disabled={disabled}
                        />
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell
                    sx={{
                      position: "sticky",
                      right: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                      padding: "0 8px",
                      width: "10px",
                      textAlign: "center",
                    }}
                  >
                    {!!index && (
                      <DeleteAction
                        disabled={disabled}
                        onClick={() => {
                          if (field.id) {
                            setDeletedAutoShiftTimingsId([
                              ...(deletedAutoShiftTimingsId ?? []),
                              {
                                id: field.id,
                                action: "delete",
                              },
                            ]);
                          }

                          handleRemoveRow(index);
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <PadBox padding={{ padding: "15px" }}>
        <Divider>
          <Button
            variant="contained"
            onClick={handleAddNewRow}
            disabled={
              !!errors?.auto_shift_timings ||
              !hasValidShiftEntries ||
              disabled ||
              fields.length > 3
            }
          >
            Add New
          </Button>
        </Divider>
      </PadBox>
    </Stack>
  );
};
