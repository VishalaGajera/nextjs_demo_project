import {
  Button,
  DeleteAction,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import {
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type {
  LateArrivalPenaltyConditionType,
  PenaltyRulesFormFieldValues,
} from "../PenaltyRulesForm";

export type SlabFields = Partial<{
  id: string | null;
  late_from_minutes: number | null;
  late_to_minutes: number | null;
  penalty_deduction_minutes: number | null;
  late_from_count: number | null;
  late_to_count: number | null;
  penalty_deduction_day: number | null;
}>;

type PenaltySlabTableProps = {
  deletedPenaltySlabId?: LateArrivalPenaltyConditionType;
  setDeletedPenaltySlabId?: (slabId: LateArrivalPenaltyConditionType) => void;
};

export const PenaltySlabTable = ({
  deletedPenaltySlabId,
  setDeletedPenaltySlabId,
}: PenaltySlabTableProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const mode = searchParams.get("page");

  const isViewMode = mode === "view-penalty-rules";

  const {
    watch,
    setValue,
    clearErrors,
    control,
    formState: { errors, defaultValues },
  } = useFormContext<PenaltyRulesFormFieldValues>();

  const penaltyBasis = watch("late_arrival_penalty_condition.penalty_basis");

  const [prevPenaltyBasis, setPrevPenaltyBasis] = useState(penaltyBasis);

  const penaltySlabs =
    watch("late_arrival_penalty_condition.penalty_slabs") ?? [];

  const { append, fields, remove } = useFieldArray({
    name: "late_arrival_penalty_condition.penalty_slabs",
    keyName: "arrayId",
    control,
  });

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const isHourlyPenalty = penaltyBasis === "hour";

  const lateFromKey = isHourlyPenalty ? "late_from_minutes" : "late_from_count";

  const lateToKey = isHourlyPenalty ? "late_to_minutes" : "late_to_count";

  const penaltyDeductionKey = isHourlyPenalty
    ? "penalty_deduction_minutes"
    : "penalty_deduction_day";

  const headers = isHourlyPenalty
    ? [
        "Late From (Minutes)",
        "Late To (Minutes)",
        "Penalty Deduction (Minutes)",
        "Actions",
      ]
    : [
        "Late From (Count)",
        "Late To (Count)",
        "Penalty Deduction (Days)",
        "Actions",
      ];

  const preRowEndTime = watch(
    `late_arrival_penalty_condition.penalty_slabs.${penaltySlabs.length - 1}.${lateToKey}`
  );

  useEffect(() => {
    if (
      defaultValues?.late_arrival_penalty_condition?.penalty_basis !==
      penaltyBasis
    ) {
      setValue("late_arrival_penalty_condition.penalty_slabs", [], {
        shouldDirty: false,
      });
    } else if (prevPenaltyBasis !== penaltyBasis) {
      setValue(
        "late_arrival_penalty_condition.penalty_slabs",
        (defaultValues?.late_arrival_penalty_condition
          ?.penalty_slabs as SlabFields[]) || []
      );
    }

    setPrevPenaltyBasis(penaltyBasis);
  }, [penaltyBasis]);

  if (!fields.length) {
    append({
      action: "add",
      [lateFromKey]: null,
      [lateToKey]: null,
      [penaltyDeductionKey]: null,
    });
  }

  const handleAddNewRow = () => {
    if (penaltySlabs) {
      setValue("late_arrival_penalty_condition.penalty_slabs", [
        ...penaltySlabs,
        {
          action: "add",
          [lateFromKey]: (preRowEndTime && preRowEndTime + 1) ?? null,
          [lateToKey]: null,
          [penaltyDeductionKey]: null,
        },
      ]);
    }
  };

  const handleRemoveRow = (index: number) => {
    clearErrors("late_arrival_penalty_condition.penalty_slabs");
    remove(index);
  };

  return (
    <Stack gap="15px">
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: slate[700] }}>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.map((field, index) => {
            const errorPath =
              errors?.late_arrival_penalty_condition?.penalty_slabs?.[index];

            return (
              <TableRow sx={{ verticalAlign: "baseline" }} key={field.arrayId}>
                {([lateFromKey, lateToKey, penaltyDeductionKey] as const).map(
                  (fieldKey) => (
                    <TableCell
                      key={fieldKey}
                      sx={{ width: "30%", borderBottom: "none" }}
                    >
                      <TextField
                        control={control}
                        name={`late_arrival_penalty_condition.penalty_slabs.${index}.${fieldKey}`}
                        placeholder="00"
                        type="number"
                        disabled={isViewMode}
                        error={!!errorPath?.[fieldKey]}
                        helperText={errorMessages(
                          errorPath?.[fieldKey]?.message
                        )}
                      />
                    </TableCell>
                  )
                )}

                <TableCell sx={{ borderBottom: "none" }}>
                  <DeleteAction
                    onClick={() => {
                      if (setDeletedPenaltySlabId && field.id) {
                        setDeletedPenaltySlabId({
                          ...deletedPenaltySlabId,
                          penalty_slabs: [
                            ...(deletedPenaltySlabId?.penalty_slabs || []),
                            { id: field.id, action: "delete" },
                          ],
                        });
                      }
                      handleRemoveRow(index);
                    }}
                    disabled={fields.length <= 1 || isViewMode}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <PadBox padding={{ padding: "15px" }}>
        <Divider>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNewRow}
            disabled={
              Object.keys(errors).some((key) =>
                key.startsWith("late_arrival_penalty_condition.penalty_slabs")
              ) ||
              isViewMode ||
              !preRowEndTime
            }
          >
            Add New
          </Button>
        </Divider>
      </PadBox>
    </Stack>
  );
};
