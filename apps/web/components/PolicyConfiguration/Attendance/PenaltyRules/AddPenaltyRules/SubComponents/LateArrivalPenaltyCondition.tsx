import { CheckBox, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EvaluationPeriodAutoComplete } from "../../../../../common/Autocomplete/EvaluationPeriodAutoComplete";
import { PenaltyBaseAutoComplete } from "../../../../../common/Autocomplete/PenaltyBaseAutoComplete";
import type {
  LateArrivalPenaltyConditionType,
  PenaltyRulesFormFieldValues,
} from "../PenaltyRulesForm";
import { PenaltySlabTable } from "./PenaltySlabTable";

type LateArrivalPenaltyConditionProps = {
  loading?: boolean;
  deletedPenaltySlabId?: LateArrivalPenaltyConditionType;
  setDeletedPenaltySlabId?: (slabId: LateArrivalPenaltyConditionType) => void;
};

export const LateArrivalPenaltyCondition = ({
  loading = false,
  deletedPenaltySlabId,
  setDeletedPenaltySlabId,
}: LateArrivalPenaltyConditionProps) => {
  const { t } = useTranslation();

  const {
    watch,
    control,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext<PenaltyRulesFormFieldValues>();

  const searchParams = useSearchParams();

  const mode = searchParams.get("page");

  const isViewMode = mode === "view-penalty-rules";

  const theme = useTheme();

  const { slate, red } = theme.palette.app.color;

  const errorMessages = (messageKey?: string) => messageKey && t(messageKey);

  const penalty_basis = watch("late_arrival_penalty_condition.penalty_basis");

  const penalty_deduction_source = watch(
    "late_arrival_penalty_condition.penalty_deduction_source"
  );

  const is_late_arrival_penalty_enabled = watch(
    "is_late_arrival_penalty_enabled"
  );

  const defaultLateArrivalPenaltyValues = {
    penalty_basis: null,
    max_allowed_instances: null,
    evaluation_period: null,
    leave_deduction_days: null,
    penalty_increment_threshold_days: null,
    penalty_deduction_source: null,
    penalty_slabs: null,
  };

  useMemo(() => {
    if (!is_late_arrival_penalty_enabled) {
      if (
        Object.keys(errors).some((key) =>
          key.startsWith("late_arrival_penalty_condition")
        )
      ) {
        clearErrors("late_arrival_penalty_condition");
      }

      setValue(
        "late_arrival_penalty_condition",
        defaultLateArrivalPenaltyValues
      );
    } else if (
      is_late_arrival_penalty_enabled &&
      penalty_basis === "instance" &&
      !penalty_deduction_source
    ) {
      setValue(
        "late_arrival_penalty_condition.penalty_deduction_source",
        "loss_of_pay",
        { shouldDirty: true }
      );
    } else if (is_late_arrival_penalty_enabled && penalty_basis === "count") {
      setValue("late_arrival_penalty_condition.evaluation_period", "month", {
        shouldDirty: true,
      });
    }
  }, [
    is_late_arrival_penalty_enabled,
    penalty_basis,
    clearErrors,
    setValue,
    errors,
  ]);

  useMemo(() => {
    const commonFields = [
      "late_arrival_penalty_condition.leave_deduction_days",
      "late_arrival_penalty_condition.penalty_increment_threshold_days",
      "late_arrival_penalty_condition.penalty_deduction_source",
      "late_arrival_penalty_condition.max_allowed_instances",
    ];

    const fieldsToUpdate = {
      hour: commonFields,
      count: commonFields,
      instance: ["late_arrival_penalty_condition.penalty_slabs"],
    };

    if (
      penalty_basis === "hour" ||
      penalty_basis === "instance" ||
      penalty_basis === "count"
    ) {
      const currentFieldsToUpdate = fieldsToUpdate[penalty_basis];

      currentFieldsToUpdate.forEach((field) => {
        const currentValue = getValues(
          field as keyof PenaltyRulesFormFieldValues
        );

        if (currentValue !== null) {
          setValue(field as keyof PenaltyRulesFormFieldValues, null, {
            shouldDirty: false,
          });
        }
      });
    }
  }, [penalty_basis]);

  return (
    <Stack gap="10px">
      <Stack direction="row" gap="10px">
        <CheckBox
          name="is_late_arrival_penalty_enabled"
          control={control}
          disabled={isViewMode}
          size="small"
          loading={loading}
        />

        <Typography variant="body1" fontWeight={500}>
          Do you want system to apply penalty for late arrival instances?
        </Typography>
      </Stack>

      {is_late_arrival_penalty_enabled && (
        <Stack gap="10px" paddingLeft="30px">
          <Stack
            direction="row"
            gap="5px"
            alignItems="center"
            color={slate[900]}
          >
            <Typography variant="body1" fontWeight={500}>
              Apply penalty for employees
            </Typography>

            <PenaltyBaseAutoComplete
              control={control}
              loading={loading}
              hideLabel
              disableClearable
              error={!!errors.late_arrival_penalty_condition?.penalty_basis}
              helperText={errorMessages(
                errors.late_arrival_penalty_condition?.penalty_basis?.message
              )}
              disabled={isViewMode}
              name="late_arrival_penalty_condition.penalty_basis"
              sx={{ width: "320px" }}
              required
            />

            {penalty_basis === "hour" || penalty_basis === "count" ? (
              <>
                <Typography variant="body1">of late arrival on</Typography>

                <EvaluationPeriodAutoComplete
                  control={control}
                  loading={loading}
                  hideLabel
                  error={
                    !!errors.late_arrival_penalty_condition?.evaluation_period
                  }
                  helperText={errorMessages(
                    errors.late_arrival_penalty_condition?.evaluation_period
                      ?.message
                  )}
                  name="late_arrival_penalty_condition.evaluation_period"
                  sx={{ width: "170px" }}
                  disabled={penalty_basis === "count" || isViewMode}
                  required
                />
              </>
            ) : (
              <Typography variant="body1">of late arrival.</Typography>
            )}
          </Stack>

          {penalty_basis === "instance" && (
            <Stack gap="15px">
              <Stack
                direction="row"
                gap="5px"
                alignItems="center"
                color={slate[900]}
              >
                <Typography variant="body1" fontWeight={500}>
                  Late come arrival Instances allowed
                </Typography>

                <TextField
                  control={control}
                  type="number"
                  name="late_arrival_penalty_condition.max_allowed_instances"
                  placeholder="00"
                  loading={loading}
                  disabled={isViewMode}
                  required
                  error={
                    !!errors.late_arrival_penalty_condition
                      ?.max_allowed_instances
                  }
                  helperText={errorMessages(
                    errors.late_arrival_penalty_condition?.max_allowed_instances
                      ?.message
                  )}
                  sx={{ width: "100%", maxWidth: "170px" }}
                />

                <Typography variant="body1">days in a</Typography>

                <EvaluationPeriodAutoComplete
                  control={control}
                  loading={loading}
                  hideLabel
                  excludeDay
                  error={
                    !!errors.late_arrival_penalty_condition?.evaluation_period
                  }
                  helperText={errorMessages(
                    errors.late_arrival_penalty_condition?.evaluation_period
                      ?.message
                  )}
                  name="late_arrival_penalty_condition.evaluation_period"
                  sx={{ width: "170px" }}
                  disabled={isViewMode}
                  required
                />
              </Stack>

              <Stack direction="column" gap="10px">
                <Typography variant="body1" fontWeight={500}>
                  Leave is deducted as Follows:
                </Typography>

                <Stack
                  direction="row"
                  alignItems="baseline"
                  gap="5px"
                  color={slate[900]}
                >
                  <Typography>
                    Post late come arrival allowed instances, deduct{" "}
                  </Typography>

                  <TextField
                    control={control}
                    type="number"
                    name="late_arrival_penalty_condition.leave_deduction_days"
                    placeholder="00"
                    loading={loading}
                    disabled={isViewMode}
                    required
                    error={
                      !!errors.late_arrival_penalty_condition
                        ?.leave_deduction_days
                    }
                    helperText={errorMessages(
                      errors.late_arrival_penalty_condition
                        ?.leave_deduction_days?.message
                    )}
                    sx={{ width: "100%", maxWidth: "170px" }}
                  />
                  <Typography>days of leave for every</Typography>

                  <TextField
                    control={control}
                    type="number"
                    name="late_arrival_penalty_condition.penalty_increment_threshold_days"
                    placeholder="00"
                    loading={loading}
                    disabled={isViewMode}
                    required
                    error={
                      !!errors.late_arrival_penalty_condition
                        ?.penalty_increment_threshold_days
                    }
                    helperText={errorMessages(
                      errors.late_arrival_penalty_condition
                        ?.penalty_increment_threshold_days?.message
                    )}
                    sx={{ width: "100%", maxWidth: "170px" }}
                  />

                  <Typography>days of late come arrival.</Typography>
                </Stack>
              </Stack>

              <Stack direction="column" gap="10px">
                <Typography variant="body1" fontWeight={500}>
                  Leave Penalties Deducted From:
                </Typography>

                <Stack color={slate[900]}>
                  <RadioGroupField
                    direction="column"
                    loading={loading}
                    name="late_arrival_penalty_condition.penalty_deduction_source"
                    size="medium"
                    control={control}
                    options={[
                      {
                        values: "loss_of_pay",
                        label: "Deduct From Loss Of Pay (LOP)",
                        disabled: isViewMode,
                      },
                      {
                        values: "paid",
                        label: "Deduct From Paid Leave Balance",
                        disabled: true,
                      },
                    ]}
                  />

                  <Typography variant="body2" sx={{ color: red[900] }}>
                    {errorMessages(
                      errors.late_arrival_penalty_condition
                        ?.penalty_deduction_source?.message
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          )}

          {penalty_basis && ["hour", "count"].includes(penalty_basis) && (
            <Stack gap="15px">
              <Typography variant="body1" fontWeight={500}>
                Penalty will be applied based on the defined rule below:
              </Typography>

              <PenaltySlabTable
                deletedPenaltySlabId={deletedPenaltySlabId}
                setDeletedPenaltySlabId={setDeletedPenaltySlabId}
              />
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
};
