import {
  Button,
  DeleteAction,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import {
  Box,
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
import { isEmpty } from "lodash";
import { memo, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { digitMaxLimit } from "../../../../../../utils/helper";
import type {
  IncomeTaxRegimeFieldValues,
  TaxSlabs,
} from "./IncomeTaxRegimeForm";

export type Citizen = {
  start_range?: number | null;
  end_range?: number | null;
  surcharge_rate?: number | null;
  tax_rate?: number | null;
  id?: string;
  action?: string;
};

export const TaxSlabFormSchema = z
  .object({
    id: z.string().optional(),
    action: z.string().optional(),
    start_range: z.number().nullable().optional(),
    end_range: z.number().nullable().optional(),
    tax_rate: z.number().nullable().optional(),
    surcharge_rate: z.number().nullable().optional(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (data.start_range === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["start_range"],
      });
    }

    if (data.end_range === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["end_range"],
      });
    }

    if (data.start_range && data.start_range >= digitMaxLimit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("value.maximum.allowedLimit", {
          maxLimit: 999999999,
        }),
        path: ["start_range"],
      });
    }

    if (data.end_range && data.end_range >= digitMaxLimit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("value.maximum.allowedLimit", {
          maxLimit: 999999999,
        }),
        path: ["end_range"],
      });
    }

    if (data.tax_rate === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["tax_rate"],
      });
    }

    if (data.surcharge_rate === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["surcharge_rate"],
      });
    }

    if (data.tax_rate && data.tax_rate > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("common.invalidMaxLimit", {
          maxLimit: 100,
        }),
        path: ["tax_rate"],
      });
    }

    if (data.surcharge_rate && data.surcharge_rate > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("common.invalidMaxLimit", {
          maxLimit: 100,
        }),
        path: ["surcharge_rate"],
      });
    }

    if (data.start_range && data.end_range) {
      if (data.end_range <= data.start_range) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End Amount must be Grater than start Amount",
          path: ["end_range"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start Amount must be less than end Amount",
          path: ["start_range"],
        });
      }
    }
  });

export type TaxSlabFormFormValues = z.infer<typeof TaxSlabFormSchema>;

type TaxSlabFormFormFormProps = {
  defaultValues?: TaxSlabFormFormValues;
  loading?: boolean;
  type?: "add" | "edit" | "view";
  disabled?: boolean;
  slabType: "standard" | "senior" | "super_senior";
  setDeletedTaxSlabs: (taxSlabs?: TaxSlabs) => void;
  deletedTaxSlabs?: TaxSlabs;
};

const Headers = [
  "Start Range",
  "End Range",
  "Tax Rate(%)",
  "Surcharge Rate(%)",
  "Action",
];

const TaxSlabForm = ({
  slabType,
  loading = false,
  disabled = false,
  type = "add",
  setDeletedTaxSlabs,
  deletedTaxSlabs,
}: TaxSlabFormFormFormProps) => {
  const {
    control,
    clearErrors,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useFormContext<IncomeTaxRegimeFieldValues>();

  const { append, fields, remove } = useFieldArray({
    name: `tax_slabs.${slabType}`,
    keyName: "rowId",
    control,
  });

  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const formData = watch(`tax_slabs.${slabType}`);

  const firstRowStartAmount = watch(`tax_slabs.${slabType}.${0}.start_range`);

  const firstRowEndAmount = watch(`tax_slabs.${slabType}.${0}.end_range`);

  const preRowEndAmount = watch(
    `tax_slabs.${slabType}.${fields.length - 1}.end_range`
  );

  if (!fields || fields.length === 0) {
    append({
      ...(type === "edit" && {
        action: "add",
      }),
      start_range: null,
      end_range: null,
      tax_rate: null,
      surcharge_rate: null,
    });
  }

  const handleAddNewRow = () => {
    if (formData) {
      const updatedTaxSlabs = [
        ...formData,
        {
          ...(type === "edit" && {
            action: "add",
          }),
          start_range: (preRowEndAmount && preRowEndAmount + 1) ?? null,
          end_range: null,
          tax_rate: null,
          surcharge_rate: null,
        },
      ];

      setValue(`tax_slabs.${slabType}`, updatedTaxSlabs);
    }
  };

  const handleRemoveRow = (index: number) => {
    clearErrors(`tax_slabs.${slabType}`);

    remove(index);
  };

  useEffect(() => {
    if (
      firstRowStartAmount &&
      firstRowEndAmount &&
      firstRowStartAmount >= firstRowEndAmount
    ) {
      setError(`tax_slabs.${slabType}.${0}.start_range`, {
        type: "custom",
        message: "Start Amount must be less than end Amount",
      });
    } else {
      clearErrors(`tax_slabs.${slabType}.${0}.start_range`);
      clearErrors(`tax_slabs.${slabType}.${0}.end_range`);
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity
    formData?.forEach((slab, index) => {
      if (index > 0) {
        const previousRowEndAmount = formData?.[index - 1]?.end_range ?? null;

        const currentRowStartAmount = slab.start_range ?? null;

        if (
          previousRowEndAmount &&
          currentRowStartAmount &&
          currentRowStartAmount !== previousRowEndAmount + 1
        ) {
          setError(`tax_slabs.${slabType}.${index}.start_range`, {
            type: "custom",
            message:
              "Start Amount must be exactly one greater than the end Amount of the previous row.",
          });
        } else {
          clearErrors(`tax_slabs.${slabType}.${index}.start_range`);
        }
      }
    });
  }, [JSON.stringify(formData)]);

  return (
    <Stack gap="16px">
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: slate[700] }}>
            {Headers.map((item) => (
              <TableCell key={uuidv4()}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.map((field, index) => (
            <TableRow sx={{ verticalAlign: "baseline" }} key={field.rowId}>
              <TableCell>
                <Box maxWidth="228px">
                  <TextField
                    control={control}
                    name={`tax_slabs.${slabType}.${index}.start_range`}
                    placeholder="00"
                    loading={loading}
                    type="number"
                    error={
                      !!errors?.tax_slabs?.[slabType]?.[index]?.start_range
                    }
                    helperText={errorMessages(
                      errors?.tax_slabs?.[slabType]?.[index]?.start_range
                        ?.message
                    )}
                    disabled={disabled}
                  />
                </Box>
              </TableCell>

              <TableCell>
                <Box maxWidth="228px">
                  <TextField
                    control={control}
                    name={`tax_slabs.${slabType}.${index}.end_range`}
                    placeholder="00"
                    type="number"
                    loading={loading}
                    error={!!errors?.tax_slabs?.[slabType]?.[index]?.end_range}
                    helperText={errorMessages(
                      errors?.tax_slabs?.[slabType]?.[index]?.end_range?.message
                    )}
                    disabled={disabled}
                  />
                </Box>
              </TableCell>

              <TableCell>
                <Box maxWidth="228px">
                  <TextField
                    control={control}
                    name={`tax_slabs.${slabType}.${index}.tax_rate`}
                    placeholder="00"
                    type="number"
                    loading={loading}
                    error={!!errors?.tax_slabs?.[slabType]?.[index]?.tax_rate}
                    helperText={errorMessages(
                      errors?.tax_slabs?.[slabType]?.[index]?.tax_rate?.message
                    )}
                    disabled={disabled}
                  />
                </Box>
              </TableCell>

              <TableCell>
                <Box maxWidth="228px">
                  <TextField
                    control={control}
                    name={`tax_slabs.${slabType}.${index}.surcharge_rate`}
                    placeholder="00"
                    type="number"
                    loading={loading}
                    error={
                      !!errors?.tax_slabs?.[slabType]?.[index]?.surcharge_rate
                    }
                    helperText={errorMessages(
                      errors?.tax_slabs?.[slabType]?.[index]?.surcharge_rate
                        ?.message
                    )}
                    disabled={disabled}
                  />
                </Box>
              </TableCell>
              {fields.length > 1 && (
                <TableCell>
                  <DeleteAction
                    onClick={() => {
                      if (field.id) {
                        const deletedSlabs = {
                          ...deletedTaxSlabs,
                          [slabType]: [
                            ...(deletedTaxSlabs?.[slabType] ?? []),
                            {
                              id: field.id,
                              action: "delete",
                            },
                          ],
                        };

                        setDeletedTaxSlabs(deletedSlabs);
                      }
                      handleRemoveRow(index);
                    }}
                    disabled={disabled}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PadBox padding={{ padding: "15px" }}>
        <Divider>
          <Button
            variant="contained"
            disabled={!isEmpty(errors) || disabled || !preRowEndAmount}
            onClick={handleAddNewRow}
          >
            Add New
          </Button>
        </Divider>
      </PadBox>
    </Stack>
  );
};

export const MemoizedTaxSlabForm = memo(TaxSlabForm);
