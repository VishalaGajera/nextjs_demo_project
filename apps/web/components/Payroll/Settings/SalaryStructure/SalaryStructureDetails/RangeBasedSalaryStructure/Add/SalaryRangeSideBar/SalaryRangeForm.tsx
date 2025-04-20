import {
  Button,
  DeleteAction,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add } from "@mui/icons-material";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  useFieldArray,
  useForm,
  type UseFormSetError,
  type UseFormSetValue,
} from "react-hook-form";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../../hooks/useEnableDisableButton";
import { editButtonId } from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import {
  filterNestedChangedFormFields,
  validateMaxDigit,
} from "../../../../../../../../utils/helper";

const SalaryRangeSchema = z.object({
  id: z.string().optional(),
  action: z.string().optional(),
  description: z
    .string()
    .max(255, {
      message: "common.maxLength",
    })
    .optional()
    .nullable(),
  from_range: z.number().nullable(),
  to_range: z
    .number()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type SalaryRangeType = z.infer<typeof SalaryRangeSchema>;

const SalaryRangeFormSchema = z
  .object({
    salary_ranges: z.array(SalaryRangeSchema),
  })
  .superRefine((data, ctx) => {
    data.salary_ranges.forEach((range, index) => {
      if (range.from_range === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["salary_ranges", index, "from_range"],
        });
      }

      if (!range.to_range) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["salary_ranges", index, "to_range"],
        });
      }

      validateMaxDigit(
        ctx,
        ["salary_ranges", index, "from_range"],
        range.from_range
      );

      validateMaxDigit(
        ctx,
        ["salary_ranges", index, "to_range"],
        range.to_range
      );

      if (range.from_range && range.to_range) {
        if (range.to_range <= range.from_range) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "To range must be Grater from range",
            path: ["salary_ranges", index, "to_range"],
          });

          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "From range must be Less than to range",
            path: ["salary_ranges", index, "from_range"],
          });
        }
      }

      if (index > 0) {
        const prevRow = data.salary_ranges?.[index - 1];

        if (
          prevRow?.to_range &&
          range.from_range &&
          prevRow.to_range + 1 !== range.from_range
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Start Amount must be exactly one greater than the end time of the previous row.",
            path: ["salary_ranges", index, "from_range"],
          });
        }
      }
    });
  });

export type SalaryRangeFormType = z.infer<typeof SalaryRangeFormSchema>;

const initialValues = {
  salary_ranges: [
    {
      action: "add",
      description: "",
      from_range: null,
      to_range: null,
    },
  ],
};

type SalaryRangeFormProps = {
  defaultValues?: SalaryRangeFormType;
  loading?: boolean;
};

export type SalaryRangeFormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<SalaryRangeFormType>) => void
  ) => void;
  setError: UseFormSetError<SalaryRangeFormType>;
  setValue: UseFormSetValue<SalaryRangeFormType>;
};

export const SalaryRangeForm = forwardRef(
  (
    { loading = false, defaultValues = initialValues }: SalaryRangeFormProps,
    ref: ForwardedRef<SalaryRangeFormRef>
  ) => {
    const theme = useTheme();

    const { slate } = theme.palette.app.color;

    const HEADERS = ["From Range", "To Range", "Description", "Action"];

    const values = useMemo(() => {
      if (loading) {
        return {
          salary_ranges: Array.from({ length: 5 }, () => ({
            ...initialValues.salary_ranges[0],
          })) as SalaryRangeFormType["salary_ranges"],
        };
      }

      return defaultValues;
    }, [loading]);

    const {
      control,
      trigger,
      setValue,
      formState: { errors, isValid, dirtyFields },
      setError,
      watch,
      handleSubmit,
      clearErrors,
    } = useForm<SalaryRangeFormType>({
      values,
      resolver: zodResolver(SalaryRangeFormSchema),
      mode: "all",
    });

    const { append, fields, remove } = useFieldArray({
      name: "salary_ranges",
      control,
      keyName: "ssId",
    });

    useEnableDisableButton({
      control,
      defaultValues,
      errors,
      buttonId: editButtonId,
    });

    const errorMessage = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    useEffect(() => {
      watch("salary_ranges").forEach((range, index) => {
        if (range.from_range && range.to_range) {
          trigger([
            `salary_ranges.${index}.from_range`,
            `salary_ranges.${index}.to_range`,
          ]);
        }

        if (index > 0) {
          const previousRowToRange = fields?.[index - 1]?.to_range ?? null;

          const currentRowFromRange = range.from_range ?? null;

          if (
            previousRowToRange &&
            currentRowFromRange &&
            currentRowFromRange === previousRowToRange + 1
          ) {
            clearErrors(`salary_ranges.${index}.from_range`);
          } else {
            setError(`salary_ranges.${index}.from_range`, {
              type: "custom",
              message:
                "From range must be exactly one greater than the to range of the previous row.",
            });
          }
        }
      });
    }, [JSON.stringify(watch("salary_ranges"))]);

    const preRowToRange = watch(`salary_ranges.${fields.length - 1}.to_range`);

    const preRowFromRange = watch(
      `salary_ranges.${fields.length - 1}.from_range`
    );

    const handleAppendRow = () => {
      append([
        {
          from_range: preRowToRange ? preRowToRange + 1 : null,
          to_range: null,
          action: "add",
          description: "",
        },
      ]);
    };

    const checkIsDisabled = preRowToRange !== null && preRowFromRange !== null;

    useImperativeHandle(ref, () => {
      return {
        submitForm(onSubmit) {
          const filteredDirtyFields = dirtyFields.salary_ranges?.map(
            (range) => {
              return {
                ...range,
                action: true,
              };
            }
          );

          handleSubmit((formValues) => {
            const filterFormValues = filterNestedChangedFormFields(formValues, {
              salary_ranges: filteredDirtyFields,
            });

            onSubmit(filterFormValues);
          })();
        },
        setError,
        setValue,
      };
    });

    return (
      <>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: slate[700] }}>
              {HEADERS.map((header) => {
                return <TableCell key={uuid()}>{header}</TableCell>;
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.map((field, index) => {
              return (
                <TableRow key={field.ssId} sx={{ verticalAlign: "baseline" }}>
                  <TableCell
                    sx={{
                      verticalAlign: "top !important",
                      padding: "14px",
                      width: "250px",
                    }}
                  >
                    <TextField
                      loading={loading}
                      control={control}
                      fullWidth
                      placeholder="Enter from range"
                      type="number"
                      error={!!errors.salary_ranges?.[index]?.from_range}
                      helperText={errorMessage(
                        errors.salary_ranges?.[index]?.from_range?.message
                      )}
                      name={`salary_ranges.${index}.from_range`}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      verticalAlign: "top !important",
                      padding: "14px",
                      width: "250px",
                    }}
                  >
                    <TextField
                      control={control}
                      type="number"
                      fullWidth
                      loading={loading}
                      placeholder="Enter to range"
                      error={!!errors.salary_ranges?.[index]?.to_range}
                      helperText={errorMessage(
                        errors.salary_ranges?.[index]?.to_range?.message
                      )}
                      name={`salary_ranges.${index}.to_range`}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      verticalAlign: "top !important",
                      padding: "14px",
                      width: "250px",
                    }}
                  >
                    <TextField
                      control={control}
                      loading={loading}
                      fullWidth
                      placeholder="Enter description"
                      error={!!errors.salary_ranges?.[index]?.description}
                      helperText={errorMessage(
                        errors.salary_ranges?.[index]?.description?.message
                      )}
                      name={`salary_ranges.${index}.description`}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      verticalAlign: "top !important",
                      padding: "14px",
                      width: "100px",
                    }}
                  >
                    <DeleteAction
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <PadBox padding={{ padding: "5px" }}>
          <Divider>
            <Button
              variant="contained"
              disabled={!checkIsDisabled || !isValid}
              startIcon={<Add />}
              onClick={() => handleAppendRow()}
              sx={{ width: "fit-content" }}
            >
              Add New
            </Button>
          </Divider>
        </PadBox>
      </>
    );
  }
);

SalaryRangeForm.displayName = "SalaryRangeForm";
