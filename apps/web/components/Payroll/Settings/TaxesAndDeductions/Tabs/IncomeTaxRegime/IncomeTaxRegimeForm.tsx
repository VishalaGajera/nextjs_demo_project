import { FormRow, PadBox, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { split, trim } from "lodash";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { FormProvider, useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import {
  filterNestedChangedFormFields,
  validateMaxDigit,
} from "../../../../../../utils/helper";
import { FinancialYearAutocomplete } from "../../../../../common/Autocomplete/FinancialYearAutocomplete";
import { RegimeTypeAutocomplete } from "../../../../../common/Autocomplete/RegimeTypeAutocomplete";
import {
  type Citizen,
  MemoizedTaxSlabForm,
  TaxSlabFormSchema,
} from "./TaxSlabForm";
import { type IncomeTaxRegimePayload } from "./hooks/useAddIncomeTaxRegime";

const IncomeTaxRegimeFormSchema = z
  .object({
    financial_year: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, { message: "common.required" }),
    regime_type: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, { message: "common.required" }),
    standard_deduction_limit: z.number().nullable().optional(),
    health_education_cess_rate: z
      .number()
      .min(0)
      .max(100)
      .nullable()
      .optional(),
    tax_slabs: z
      .object({
        standard: z.array(TaxSlabFormSchema).optional(),
        senior: z.array(TaxSlabFormSchema).optional(),
        super_senior: z.array(TaxSlabFormSchema).optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.health_education_cess_rate === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["health_education_cess_rate"],
      });
    }

    if (data.standard_deduction_limit === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["standard_deduction_limit"],
      });
    }

    validateMaxDigit(
      ctx,
      "standard_deduction_limit",
      data.standard_deduction_limit
    );

    if (!data.financial_year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["financial_year"],
      });
    }

    // Define the slab keys
    const slabKeys = ["standard", "senior", "super_senior"] as const;

    slabKeys.forEach((slabType) => {
      const slabs = data.tax_slabs?.[slabType];

      if (!slabs || slabs.length === 0) {
        return;
      }

      if (slabs?.[0]?.start_range && slabs[0].end_range) {
        if (slabs[0].start_range >= slabs[0].end_range) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start Amount must be less than End Amount",
            path: ["tax_slabs", slabType, 0, "start_range"],
          });
        }
      }

      // Validate subsequent rows
      slabs.forEach((slab, index) => {
        if (index > 0) {
          const previousRowEndAmount = slabs[index - 1]?.end_range;

          const currentRowStartAmount = slab.start_range;

          if (
            previousRowEndAmount &&
            currentRowStartAmount &&
            currentRowStartAmount !== previousRowEndAmount + 1
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Start Amount must be exactly one greater than the End Amount of the previous row.",
              path: ["tax_slabs", slabType, index, "start_range"],
            });
          }
        }
      });
    });
  });

export type IncomeTaxRegimeFieldValues = z.infer<
  typeof IncomeTaxRegimeFormSchema
>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<IncomeTaxRegimePayload>) => void
  ) => void;
  setError: UseFormSetError<IncomeTaxRegimeFieldValues>;
};

export type TaxSlabs = Partial<{
  standard: Citizen[];
  senior: Citizen[];
  super_senior: Citizen[];
}>;

type IncomeTaxRegimeFormProps = {
  type?: "add" | "edit" | "view";
  defaultValues?: Partial<IncomeTaxRegimeFieldValues>;
  loading?: boolean;
  disabled?: boolean;
};

const citizenDefaultValues = [
  {
    start_range: null,
    end_range: null,
    tax_rate: null,
    surcharge_rate: null,
  },
];

const formDefaultValues: Partial<IncomeTaxRegimeFieldValues> = {
  regime_type: null,
  financial_year: null,
  health_education_cess_rate: null,
  standard_deduction_limit: null,
  tax_slabs: {
    standard: citizenDefaultValues,
    senior: citizenDefaultValues,
    super_senior: citizenDefaultValues,
  },
};

export const IncomeTaxRegimeForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
      type = "add",
    }: IncomeTaxRegimeFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const [deletedTaxSlabs, setDeletedTaxSlabs] = useState<TaxSlabs>();

    const formMethods = useForm<IncomeTaxRegimeFieldValues>({
      values: defaultValues,
      resolver: zodResolver(IncomeTaxRegimeFormSchema),
      mode: "all",
    });

    const theme = useTheme();

    const { iron } = theme.palette.app.color;

    const {
      setError,
      control,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = formMethods;

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const getFinancialYear = (value?: string | null) => {
      const [startDate, endDate] = split(value, "|").map(trim);

      return {
        start_date: startDate,
        end_date: endDate,
      };
    };

    useEnableDisableButton({
      control,
      defaultValues,
      errors,
      buttonId: submitButtonId,
    });

    const getTaxSlabsDirtyFields = (type: keyof TaxSlabs) => {
      const contributionSlabsDirtyFields = Array.isArray(
        dirtyFields.tax_slabs?.[type]
      )
        ? dirtyFields.tax_slabs?.[type].map((slab) => {
            const hasAnyTrueValue = Object.values(slab).some(
              // eslint-disable-next-line sonarjs/no-nested-functions
              (value) => value === true
            );

            return {
              id: hasAnyTrueValue,
              action: hasAnyTrueValue,
              start_range: hasAnyTrueValue,
              end_range: hasAnyTrueValue,
              surcharge_rate: hasAnyTrueValue,
              tax_rate: hasAnyTrueValue,
            };
          })
        : [];

      return contributionSlabsDirtyFields;
    };

    const getUpdatedTaxSlabs = (
      filterFormValues: Partial<IncomeTaxRegimeFieldValues>,
      formValues: Partial<IncomeTaxRegimeFieldValues>,
      type: keyof TaxSlabs
    ) => {
      const newlyAddedTaxSlabs = formValues?.tax_slabs?.[type]?.filter(
        (slab) => {
          return slab.action === "add";
        }
      );

      const taxSlabs = filterFormValues?.tax_slabs?.[type]
        ?.map((slab) => {
          return slab.id ? { ...slab, action: "update" } : { ...slab };
        })
        .filter((slab) => {
          return slab.action === "update";
        });

      const updatedContributionSlabs = [
        ...(taxSlabs ?? []),
        ...(newlyAddedTaxSlabs ?? []),
        ...(deletedTaxSlabs?.[type] ?? []),
      ];

      return updatedContributionSlabs;
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          if (type === "add") {
            onSubmit({
              ...formValues,
              financial_year: getFinancialYear(formValues.financial_year),
            });

            return;
          }

          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            tax_slabs: {
              standard: getTaxSlabsDirtyFields("standard"),
              senior: getTaxSlabsDirtyFields("senior"),
              super_senior: getTaxSlabsDirtyFields("super_senior"),
            },
          });

          const updatedStandard = getUpdatedTaxSlabs(
            filterFormValues,
            formValues,
            "standard"
          );

          const updatedSenior = getUpdatedTaxSlabs(
            filterFormValues,
            formValues,
            "senior"
          );

          const updatedSuperSenior = getUpdatedTaxSlabs(
            filterFormValues,
            formValues,
            "super_senior"
          );

          onSubmit({
            standard_deduction_limit: filterFormValues.standard_deduction_limit,
            health_education_cess_rate:
              filterFormValues.health_education_cess_rate,
            tax_slabs: {
              ...(updatedStandard.length && { standard: updatedStandard }),
              ...(updatedSenior.length && { senior: updatedSenior }),
              ...(updatedSuperSenior.length && {
                super_senior: updatedSuperSenior,
              }),
            },
          });
        })();
      },
      setError,
    }));

    return (
      <Stack gap="16px">
        <FormProvider {...formMethods}>
          <PadBox padding={{ paddingY: "15px" }}>
            <FormRow maxColumn={2}>
              <FinancialYearAutocomplete
                name="financial_year"
                required
                control={control}
                loading={loading}
                disabled={disabled || type === "edit"}
                error={!!errors.financial_year}
                helperText={errorMessages(errors.financial_year?.message)}
              />

              <RegimeTypeAutocomplete
                name="regime_type"
                required
                control={control}
                loading={loading}
                disabled={disabled || type === "edit"}
                error={!!errors.regime_type}
                helperText={errorMessages(errors.regime_type?.message)}
              />
            </FormRow>
          </PadBox>

          <Typography variant="h5">Tax Slab Rate Configuration</Typography>

          <Box
            sx={{
              border: "1px solid ",
              borderColor: iron[700],
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <Typography variant="h6" sx={{ paddingBottom: "15px" }}>
              Standard Taxpayer(Below 60)
            </Typography>

            <MemoizedTaxSlabForm
              slabType="standard"
              type={type}
              loading={loading}
              disabled={disabled}
              setDeletedTaxSlabs={setDeletedTaxSlabs}
              deletedTaxSlabs={deletedTaxSlabs}
            />
          </Box>

          <Box
            sx={{
              border: "1px solid ",
              borderColor: iron[700],
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <Typography variant="h6" sx={{ paddingBottom: "15px" }}>
              Senior Citizen(60 to 80)
            </Typography>

            <MemoizedTaxSlabForm
              slabType="senior"
              type={type}
              loading={loading}
              disabled={disabled}
              setDeletedTaxSlabs={setDeletedTaxSlabs}
              deletedTaxSlabs={deletedTaxSlabs}
            />
          </Box>

          <Box
            sx={{
              border: "1px solid ",
              borderColor: iron[700],
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <Typography variant="h6" sx={{ paddingBottom: "15px" }}>
              Super Senior Citizen(80 and Above)
            </Typography>

            <MemoizedTaxSlabForm
              disabled={disabled}
              loading={loading}
              type={type}
              slabType="super_senior"
              setDeletedTaxSlabs={setDeletedTaxSlabs}
              deletedTaxSlabs={deletedTaxSlabs}
            />
          </Box>

          <Stack gap="10px" direction="row" alignItems="center">
            <Typography variant="body1">
              Health and Education Cess is calculated as
            </Typography>

            <TextField
              name="health_education_cess_rate"
              required
              control={control}
              type="number"
              loading={loading}
              disabled={disabled}
              error={!!errors.health_education_cess_rate}
              helperText={errorMessages(
                errors.health_education_cess_rate?.message
              )}
            />

            <Typography variant="body1">% of Income Tax + Surcharge</Typography>
          </Stack>

          <Stack gap="10px" direction="row" alignItems="center">
            <Typography variant="body1">Standard Deduction Limit</Typography>

            <TextField
              sx={{ maxWidth: "215px" }}
              name="standard_deduction_limit"
              required
              type="number"
              control={control}
              loading={loading}
              disabled={disabled}
              error={!!errors.standard_deduction_limit}
              helperText={errorMessages(
                errors.standard_deduction_limit?.message
              )}
            />
          </Stack>
        </FormProvider>
      </Stack>
    );
  }
);

IncomeTaxRegimeForm.displayName = "IncomeTaxRegimeForm";
