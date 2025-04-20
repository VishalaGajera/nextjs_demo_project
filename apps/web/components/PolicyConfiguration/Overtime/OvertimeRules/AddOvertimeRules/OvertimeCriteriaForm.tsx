import {
  Button,
  DeleteAction,
  FormRow,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { OvertimeRateTypeAutoComplete } from "../../../../common/Autocomplete/OvertimeRateTypeAutoComplete";
import type {
  DayTypeFormFields,
  OvertimeRulesFormFieldValues,
} from "./AddOvertimeRulesForm";

export type dayTypes = "working_day" | "weekly_off_day" | "holiday_day";

type OvertimeCriteriaFormProps = {
  dayType: dayTypes;
  loading?: boolean;
  disabled?: boolean;
  deletedOTcriteriaId?: DayTypeFormFields;
  setDeletedOTcriteriaId?: (criteriaId: DayTypeFormFields) => void;
};

const positiveNumberValidation = (value: number | null) => {
  return !(value && Number(value) < 0);
};

export const overtimeCriteriaSchema = z
  .object({
    id: z.string().uuid().optional().nullable(),
    action: z.string().optional(),
    overtime_start_minutes: z
      .number()
      .nullable()
      .refine((value) => positiveNumberValidation(value), {
        message: "Start time must be a positive number",
      }),
    overtime_end_minutes: z
      .number()
      .nullable()
      .refine((value) => positiveNumberValidation(value), {
        message: "End time must be a positive number",
      }),
    overtime_rate_type_id: z.string().optional().nullable(),
    overtime_rate_type_day: z.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.overtime_start_minutes && data.overtime_end_minutes) {
      if (data.overtime_start_minutes >= data.overtime_end_minutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["overtime_start_minutes"],
          message: "Start time must be less than end time",
        });
      }

      if (data.overtime_end_minutes <= data.overtime_start_minutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["overtime_end_minutes"],
          message: "End time must be greater than start time",
        });
      }
    }
  });

export const OvertimeCriteriaForm = ({
  dayType,
  loading = false,
  disabled = false,
  setDeletedOTcriteriaId,
  deletedOTcriteriaId,
}: OvertimeCriteriaFormProps) => {
  const {
    control,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<OvertimeRulesFormFieldValues>();

  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const { append, fields, remove } = useFieldArray({
    name: `${dayType}.paid_overtime_criteria`,
    keyName: "arrayId",
    control,
  });

  const preRowEndTime = watch(
    `${dayType}.paid_overtime_criteria.${fields.length - 1}.overtime_end_minutes`
  );

  const calculationUnitType = watch(`${dayType}.calculation_unit_type`);

  const formData = watch(`${dayType}.paid_overtime_criteria`);

  const firstRowStartTime = watch(
    `${dayType}.paid_overtime_criteria.${0}.overtime_start_minutes`
  );

  const firstRowEndTime = watch(
    `${dayType}.paid_overtime_criteria.${0}.overtime_end_minutes`
  );

  let currentRowStartTime: number | null = null;

  let previousRowEndTime: number | null = null;

  useEffect(() => {
    if (
      firstRowStartTime &&
      firstRowEndTime &&
      firstRowStartTime >= firstRowEndTime
    ) {
      setError(
        `${dayType}.paid_overtime_criteria.${0}.overtime_start_minutes`,
        {
          type: "custom",
          message: "Start time must be less than end time",
        }
      );
    } else {
      clearErrors(
        `${dayType}.paid_overtime_criteria.${0}.overtime_start_minutes`
      );
      clearErrors(
        `${dayType}.paid_overtime_criteria.${0}.overtime_end_minutes`
      );
    }

    formData?.forEach((item, index) => {
      if (index > 0) {
        previousRowEndTime =
          formData?.[index - 1]?.overtime_end_minutes ?? null;
        currentRowStartTime = item.overtime_start_minutes ?? null;

        if (
          previousRowEndTime &&
          currentRowStartTime &&
          currentRowStartTime !== previousRowEndTime + 1
        ) {
          setError(
            `${dayType}.paid_overtime_criteria.${index}.overtime_start_minutes`,
            {
              type: "custom",
              message:
                "Start time must be exactly one greater than the end time of the previous row.",
            }
          );
        } else {
          clearErrors(
            `${dayType}.paid_overtime_criteria.${index}.overtime_start_minutes`
          );
        }
      }
    });
  }, [JSON.stringify(formData)]);

  const company_id = watch("company_id") ?? "";

  if (!fields || fields.length === 0) {
    append({
      action: "add",
      overtime_start_minutes: null,
      overtime_end_minutes: null,
      overtime_rate_type_id: null,
      overtime_rate_type_day: null,
    });
  }

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const handleAddNewRow = () => {
    if (formData) {
      const updatedOTcriteria = [
        ...formData,
        {
          overtime_start_minutes: (preRowEndTime && preRowEndTime + 1) ?? null,
          overtime_end_minutes: null,
          overtime_rate_type_id: null,
          overtime_rate_type_day: null,
          action: "add",
        },
      ];

      setValue(`${dayType}.paid_overtime_criteria`, updatedOTcriteria);
    }
  };

  const handleRemoveRow = (index: number) => {
    clearErrors(`${dayType}.paid_overtime_criteria`);

    remove(index);
  };

  useEffect(() => {
    formData?.forEach((_, index) => {
      if (calculationUnitType !== "hours") {
        setValue(
          `${dayType}.paid_overtime_criteria.${index}.overtime_rate_type_id`,
          null,
          { shouldDirty: false }
        );
      } else {
        setValue(
          `${dayType}.paid_overtime_criteria.${index}.overtime_rate_type_day`,
          null,
          { shouldDirty: false }
        );
      }
    });
  }, [calculationUnitType, formData]);

  return (
    <Stack gap="10px">
      <Box
        sx={{
          border: "1px solid",
          borderRadius: "4px",
          borderColor: slate[700],
          width: "50%",
        }}
      >
        <Box
          sx={{
            backgroundColor: slate[700],
            borderRadius: "4px",
            p: 1,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1" fontWeight="500" flex={5}>
              Overtime Range
            </Typography>
            <Typography
              variant="body1"
              fontWeight="500"
              flex={5}
              textAlign="center"
            >
              Overtime Calculation Type
            </Typography>
            <Typography
              variant="body1"
              fontWeight="500"
              flex={2}
              textAlign="center"
            >
              Action
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ overflowY: "auto", maxHeight: "490px" }}>
          {fields.map((item, index) => (
            <Stack
              direction="row"
              alignItems="start"
              justifyContent="center"
              key={item.arrayId}
              spacing={2}
              sx={{ p: 1 }}
            >
              <Stack flex={5} alignItems="center">
                <FormRow maxColumn={2}>
                  <TextField
                    name={`${dayType}.paid_overtime_criteria.${index}.overtime_start_minutes`}
                    control={control}
                    loading={loading}
                    disabled={disabled}
                    label="Start Minutes"
                    type="number"
                    required
                    error={
                      !!errors?.[dayType]?.paid_overtime_criteria?.[index]
                        ?.overtime_start_minutes
                    }
                    helperText={errorMessages(
                      errors?.[dayType]?.paid_overtime_criteria?.[index]
                        ?.overtime_start_minutes?.message
                    )}
                  />

                  <TextField
                    name={`${dayType}.paid_overtime_criteria.${index}.overtime_end_minutes`}
                    control={control}
                    label="End Minutes"
                    type="number"
                    required
                    loading={loading}
                    disabled={disabled}
                    error={
                      !!errors?.[dayType]?.paid_overtime_criteria?.[index]
                        ?.overtime_end_minutes
                    }
                    helperText={errorMessages(
                      errors?.[dayType]?.paid_overtime_criteria?.[index]
                        ?.overtime_end_minutes?.message
                    )}
                  />
                </FormRow>
              </Stack>
              <Stack flex={5} alignItems="center">
                {calculationUnitType === "hours" ? (
                  <OvertimeRateTypeAutoComplete
                    companyId={company_id}
                    control={control}
                    loading={loading}
                    disabled={disabled}
                    name={`${dayType}.paid_overtime_criteria.${index}.overtime_rate_type_id`}
                    label="Calculation Unit Type"
                    required
                    error={
                      !!errors?.[dayType]?.paid_overtime_criteria?.[index]
                        ?.overtime_rate_type_id
                    }
                    helperText={errorMessages(
                      errors?.[dayType]?.paid_overtime_criteria?.[index]
                        ?.overtime_rate_type_id?.message
                    )}
                  />
                ) : (
                  <TextField
                    control={control}
                    name={`${dayType}.paid_overtime_criteria.${index}.overtime_rate_type_day`}
                    label="Overtime Calculation Type"
                    type="number"
                    required
                    loading={loading}
                    disabled={disabled}
                    error={
                      !!errors?.[dayType]?.paid_overtime_criteria?.[index]
                        ?.overtime_rate_type_day
                    }
                    helperText={errorMessages(
                      errors?.[dayType]?.paid_overtime_criteria?.[index]
                        ?.overtime_rate_type_day?.message
                    )}
                  />
                )}
              </Stack>
              <Stack flex={2} alignItems="center">
                {index > 0 && (
                  <DeleteAction
                    onClick={() => {
                      if (setDeletedOTcriteriaId && item.id) {
                        const updatedOTcriteriaId: DayTypeFormFields = {
                          ...deletedOTcriteriaId,
                          [dayType]: {
                            paid_overtime_criteria: [
                              ...(deletedOTcriteriaId?.[dayType]
                                ?.paid_overtime_criteria || []),
                              {
                                id: item.id,
                                action: "delete",
                              },
                            ],
                          },
                        };

                        setDeletedOTcriteriaId(updatedOTcriteriaId);
                      }
                      handleRemoveRow(index);
                    }}
                  />
                )}
              </Stack>
            </Stack>
          ))}
        </Box>
        <PadBox padding={{ padding: "15px" }}>
          <Divider>
            <Button
              variant="contained"
              onClick={handleAddNewRow}
              disabled={
                disabled ||
                Object.keys(errors).length > 0 ||
                !preRowEndTime ||
                !firstRowStartTime
              }
            >
              Add New
            </Button>
          </Divider>
        </PadBox>
      </Box>
    </Stack>
  );
};
