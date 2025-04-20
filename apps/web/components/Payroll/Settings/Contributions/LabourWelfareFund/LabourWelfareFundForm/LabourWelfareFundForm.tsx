import {
  Button,
  DeleteAction,
  FormRow,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFieldArray, useForm, type UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import {
  digitMaxLimit,
  filterNestedChangedFormFields,
} from "../../../../../../utils/helper";
import { DurationAutocomplete } from "../../../../../common/Autocomplete/DurationAutocomplete";
import { MonthAutocomplete } from "../../../../../common/Autocomplete/MonthAutocomplete";
import { StateAutocomplete } from "../../../../../common/Autocomplete/StateAutocomplete";

const contributionSlabsSchema = z
  .object({
    id: z.string().optional(),
    action: z.string().optional(),
    start_amount: z.number().nullable().optional(),
    end_amount: z.number().nullable().optional(),
    employee_contribution_rate: z.number().nullable().optional(),
    employer_contribution_rate: z.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.start_amount !== null &&
      data.start_amount !== undefined &&
      data.start_amount >= digitMaxLimit
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("value.maximum.allowedLimit", {
          maxLimit: 999999999,
        }),
        path: ["start_amount"],
      });
    }

    if (
      data.end_amount !== null &&
      data.end_amount !== undefined &&
      data.end_amount >= digitMaxLimit
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("value.maximum.allowedLimit", {
          maxLimit: 999999999,
        }),
        path: ["end_amount"],
      });
    }

    if (data.start_amount && data.end_amount) {
      if (data.end_amount <= data.start_amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End Amount must be Grater than start Amount",
          path: ["end_amount"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start Amount must be less than end Amount",
          path: ["start_amount"],
        });
      }
    }

    if (
      data.employee_contribution_rate !== null &&
      data.employee_contribution_rate !== undefined &&
      data.employee_contribution_rate >= digitMaxLimit
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("value.maximum.allowedLimit", {
          maxLimit: 999999999,
        }),
        path: ["employee_contribution_rate"],
      });
    }

    if (
      data.employer_contribution_rate !== null &&
      data.employer_contribution_rate !== undefined &&
      data.employer_contribution_rate >= digitMaxLimit
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("value.maximum.allowedLimit", {
          maxLimit: 999999999,
        }),
        path: ["employer_contribution_rate"],
      });
    }
  });

type contributionSlabs = {
  start_amount?: number | null;
  end_amount?: number | null;
  employee_contribution_rate?: number | null;
  employer_contribution_rate?: number | null;
  id?: string;
  action?: string;
};

const LabourWelfareFundFormSchema = z
  .object({
    state_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    deduction_cycle_type: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    deduction_months: z.array(z.number()).nullable(),
    contribution_start_month: z.number().nullable(),
    contribution_slabs: z
      .array(contributionSlabsSchema)
      .min(1, { message: "At least one contribution slab is required" })
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.contribution_slabs) {
      if (!data.deduction_months?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["deduction_months"],
        });
      }

      data.contribution_slabs.forEach((slab, index) => {
        if (!slab.start_amount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["contribution_slabs", index, "start_amount"],
          });
        }

        if (!slab.end_amount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["contribution_slabs", index, "end_amount"],
          });
        }

        if (slab.employee_contribution_rate === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["contribution_slabs", index, "employee_contribution_rate"],
          });
        }

        if (slab.employer_contribution_rate === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["contribution_slabs", index, "employer_contribution_rate"],
          });
        }

        if (index > 0) {
          const prevRow = data.contribution_slabs?.[index - 1];

          if (
            prevRow?.end_amount &&
            slab.start_amount &&
            prevRow.end_amount + 1 !== slab.start_amount
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Start Amount must be exactly one greater than the end time of the previous row.",
              path: ["contribution_slabs", `${index}`, "start_amount"],
            });
          }
        }
      });
    }
  });

export type LabourWelfareFundFormValues = z.infer<
  typeof LabourWelfareFundFormSchema
>;

type LabourWelfareFundFormProps = {
  defaultValues?: LabourWelfareFundFormValues;
  loading?: boolean;
  type?: "edit" | "add" | "view";
};

const Headers = [
  "Start Range",
  "End Range",
  "Employee Contribution Rate",
  "Employer Contribution Rate",
  "Action",
];

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LabourWelfareFundFormValues>) => void
  ) => void;
  setError: UseFormSetError<LabourWelfareFundFormValues>;
};

const formDefaultValues: LabourWelfareFundFormValues = {
  state_id: null,
  deduction_cycle_type: null,
  deduction_months: null,
  contribution_start_month: null,
  contribution_slabs: null,
};

export const LabourWelfareFundForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      type = "add",
    }: LabourWelfareFundFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const theme = useTheme();

    const { slate } = theme.palette.app.color;

    const {
      control,
      watch,
      setError,
      clearErrors,
      setValue,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(LabourWelfareFundFormSchema),
      mode: "all",
    });

    const { append, fields, remove } = useFieldArray({
      name: "contribution_slabs",
      keyName: "arrayId",
      control,
    });

    const [deletedContributionSlabsId, setDeletedContributionSlabsId] =
      useState<contributionSlabs[]>();

    const formData = watch("contribution_slabs");

    const firstRowStartAmount = watch(`contribution_slabs.${0}.start_amount`);

    const firstRowEndAmount = watch(`contribution_slabs.${0}.end_amount`);

    const preRowEndAmount = watch(
      `contribution_slabs.${fields.length - 1}.end_amount`
    );

    useEffect(() => {
      if (
        firstRowStartAmount &&
        firstRowEndAmount &&
        firstRowStartAmount >= firstRowEndAmount
      ) {
        setError(`contribution_slabs.${0}.start_amount`, {
          type: "custom",
          message: "Start Amount must be less than end Amount",
        });
      } else {
        clearErrors(`contribution_slabs.${0}.start_amount`);
        clearErrors(`contribution_slabs.${0}.end_amount`);
      }

      // eslint-disable-next-line sonarjs/cognitive-complexity
      formData?.forEach((slab, index) => {
        if (index > 0) {
          const previousRowEndAmount =
            formData?.[index - 1]?.end_amount ?? null;

          const currentRowStartAmount = slab.start_amount ?? null;

          if (
            previousRowEndAmount &&
            currentRowStartAmount &&
            currentRowStartAmount === previousRowEndAmount + 1
          ) {
            clearErrors(`contribution_slabs.${index}.start_amount`);
          } else {
            setError(`contribution_slabs.${index}.start_amount`, {
              type: "custom",
              message:
                "Start Amount must be exactly one greater than the end Amount of the previous row.",
            });
          }
        }
      });
    }, [JSON.stringify(formData)]);

    useEnableDisableButton({ control, defaultValues, errors });

    const getContributionSlabsDirtyFields = () => {
      const contributionSlabsDirtyFields = Array.isArray(
        dirtyFields.contribution_slabs
      )
        ? dirtyFields.contribution_slabs.map((slab) => {
            const hasAnyTrueValue = Object.values(slab).some(
              // eslint-disable-next-line sonarjs/no-nested-functions
              (value) => value === true
            );

            return {
              id: hasAnyTrueValue,
              action: hasAnyTrueValue,
              start_amount: hasAnyTrueValue,
              end_amount: hasAnyTrueValue,
              employee_contribution_rate: hasAnyTrueValue,
              employer_contribution_rate: hasAnyTrueValue,
            };
          })
        : [];

      return contributionSlabsDirtyFields;
    };

    const getUpdatedContributionSlabs = (
      filterFormValues: Partial<LabourWelfareFundFormValues>,
      formValues: Partial<LabourWelfareFundFormValues>
    ) => {
      const newlyAddedContributionSlabs =
        formValues?.contribution_slabs?.filter((slab) => {
          return slab.action === "add";
        });

      const contributionSlabs = filterFormValues?.contribution_slabs
        ?.map((slab) => {
          return slab.id ? { ...slab, action: "update" } : { ...slab };
        })
        .filter((slab) => {
          return slab.action === "update";
        });

      const updatedContributionSlabs = [
        ...(contributionSlabs ?? []),
        ...(newlyAddedContributionSlabs ?? []),
        ...(deletedContributionSlabsId ?? []),
      ];

      return updatedContributionSlabs;
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          if (type === "edit") {
            const contributionSlabsDirtyFields =
              getContributionSlabsDirtyFields();

            const filterFormValues = filterNestedChangedFormFields(formValues, {
              ...dirtyFields,
              contribution_slabs: contributionSlabsDirtyFields,
            });

            const updatedContributionSlabs = getUpdatedContributionSlabs(
              filterFormValues,
              formValues
            );

            onSubmit({
              contribution_slabs: updatedContributionSlabs,
            });

            return;
          }
          onSubmit(formValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    if (!fields || fields.length === 0) {
      append({
        ...(type === "edit" && {
          action: "add",
        }),
        start_amount: null,
        end_amount: null,
        employee_contribution_rate: null,
        employer_contribution_rate: null,
      });
    }

    const handleAddNewRow = () => {
      if (formData) {
        const updatedOTcriteria = [
          ...formData,
          {
            ...(type === "edit" && {
              action: "add",
            }),
            start_amount: (preRowEndAmount && preRowEndAmount + 1) ?? null,
            end_amount: null,
            employee_contribution_rate: null,
            employer_contribution_rate: null,
          },
        ];

        setValue("contribution_slabs", updatedOTcriteria);
      }
    };

    const handleRemoveRow = (index: number) => {
      clearErrors("contribution_slabs");

      remove(index);
    };

    return (
      <Stack gap="16px">
        <FormRow maxColumn={3}>
          <StateAutocomplete
            control={control}
            loading={loading}
            required
            disabled={type === "edit" || type === "view"}
            error={!!errors.state_id}
            helperText={errorMessages(errors.state_id?.message)}
            name="state_id"
            countryId="a5317edb-609a-42ff-8ace-d40e8fd62fbc"
          />

          <DurationAutocomplete
            control={control}
            required
            disabled={type === "edit" || type === "view"}
            loading={loading}
            error={!!errors.deduction_cycle_type}
            helperText={errorMessages(errors.deduction_cycle_type?.message)}
            name="deduction_cycle_type"
          />

          <MonthAutocomplete
            control={control}
            loading={loading}
            required
            disabled={type === "edit" || type === "view"}
            label="Contribution Start Month"
            error={!!errors.contribution_start_month}
            helperText={errorMessages(errors.contribution_start_month?.message)}
            name="contribution_start_month"
          />
        </FormRow>

        <MonthAutocomplete
          control={control}
          loading={loading}
          required
          multiple
          disabled={type === "edit" || type === "view"}
          label="Select Deduction Months"
          error={!!errors.deduction_months}
          helperText={errorMessages(errors.deduction_months?.message)}
          name="deduction_months"
        />

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
              <TableRow sx={{ verticalAlign: "baseline" }} key={field.arrayId}>
                <TableCell>
                  <Box maxWidth="228px">
                    <TextField
                      control={control}
                      name={`contribution_slabs.${index}.start_amount`}
                      placeholder="00"
                      type="number"
                      error={
                        !!errors?.contribution_slabs?.[index]?.start_amount
                      }
                      helperText={errorMessages(
                        errors?.contribution_slabs?.[index]?.start_amount
                          ?.message
                      )}
                      disabled={type === "view"}
                      loading={loading}
                    />
                  </Box>
                </TableCell>

                <TableCell>
                  <Box maxWidth="228px">
                    <TextField
                      control={control}
                      name={`contribution_slabs.${index}.end_amount`}
                      placeholder="00"
                      type="number"
                      error={!!errors?.contribution_slabs?.[index]?.end_amount}
                      helperText={errorMessages(
                        errors?.contribution_slabs?.[index]?.end_amount?.message
                      )}
                      disabled={type === "view"}
                      loading={loading}
                    />
                  </Box>
                </TableCell>

                <TableCell>
                  <Box maxWidth="228px">
                    <TextField
                      control={control}
                      name={`contribution_slabs.${index}.employee_contribution_rate`}
                      placeholder="00"
                      type="number"
                      error={
                        !!errors?.contribution_slabs?.[index]
                          ?.employee_contribution_rate
                      }
                      helperText={errorMessages(
                        errors?.contribution_slabs?.[index]
                          ?.employee_contribution_rate?.message
                      )}
                      disabled={type === "view"}
                      loading={loading}
                    />
                  </Box>
                </TableCell>

                <TableCell>
                  <Box maxWidth="228px">
                    <TextField
                      control={control}
                      name={`contribution_slabs.${index}.employer_contribution_rate`}
                      placeholder="00"
                      type="number"
                      error={
                        !!errors?.contribution_slabs?.[index]
                          ?.employer_contribution_rate
                      }
                      helperText={errorMessages(
                        errors?.contribution_slabs?.[index]
                          ?.employer_contribution_rate?.message
                      )}
                      disabled={type === "view"}
                      loading={loading}
                    />
                  </Box>
                </TableCell>
                {fields.length > 1 && (
                  <TableCell>
                    <DeleteAction
                      onClick={() => {
                        if (field.id) {
                          setDeletedContributionSlabsId([
                            ...(deletedContributionSlabsId ?? []),
                            {
                              id: field.id,
                              action: "delete",
                            },
                          ]);
                        }
                        handleRemoveRow(index);
                      }}
                      disabled={type === "view"}
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
              disabled={!isEmpty(errors) || type === "view" || !preRowEndAmount}
              onClick={handleAddNewRow}
            >
              Add New
            </Button>
          </Divider>
        </PadBox>
      </Stack>
    );
  }
);

LabourWelfareFundForm.displayName = "LabourWelfareFundForm";
