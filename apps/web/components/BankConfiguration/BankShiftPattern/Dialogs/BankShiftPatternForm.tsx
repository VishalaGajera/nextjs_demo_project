import {
  Button,
  DeleteAction,
  FormRow,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add } from "@mui/icons-material";
import {
  Alert,
  Divider,
  Grid,
  Skeleton as MuiSkeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import { filterNestedChangedFormFields } from "../../../../utils/helper";
import { BankShiftSchemaAutocomplete } from "../../../common/Autocomplete/BankShiftSchemaAutocomplete";
import { CompanyAutocomplete } from "../../../common/Autocomplete/CompanyAutocomplete";
import { PatternRepeatAutocomplete } from "../../../common/Autocomplete/PatternRepeatAutocomplete";
import { PatternTypeAutocomplete } from "../../../common/Autocomplete/PatternTypeAutocomplete";

const BankShiftPatternFormSchema = z.object({
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  bank_shift_pattern_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z.string().max(255, "common.maxLength").optional().nullable(),
  pattern_type: z.string(),
  pattern_repeat: z
    .number()
    .max(5, "common.invalidNumber")
    .int()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  configurations: z
    .array(
      z.union([
        z.string().nullable(),
        z.object({
          shift: z
            .string()
            .nullable()
            .refine((value) => !!value, {
              message: "common.required",
            }),
          id: z.string().nullable().optional(),
        }),
      ])
    )
    .min(2, "At least two shifts required")
    .nullable(),
});

export type BankShiftPatternFormFieldValues = z.infer<
  typeof BankShiftPatternFormSchema
>;

type BankShiftPatternFormProps = {
  defaultValues?: BankShiftPatternFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BankShiftPatternFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<BankShiftPatternFormFieldValues>;
};

const formDefaultValues: BankShiftPatternFormFieldValues = {
  company_id: null,
  bank_shift_pattern_name: null,
  description: null,
  pattern_type: "weekly",
  pattern_repeat: 1,
  configurations: null,
};

export const BankShiftPatternForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: BankShiftPatternFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const theme = useTheme();

    const { iron } = theme.palette.app.color;

    const { t } = useTranslation();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(BankShiftPatternFormSchema),
      mode: "all",
    });

    const {
      watch,
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    const { fields, append, remove, replace } = useFieldArray({
      control,
      name: "configurations",
    });

    useMemo(() => {
      if (fields.length < 2) {
        append({
          shift: null,
        });
      }
    }, [fields.length, append]);

    const companyId = watch("company_id") ?? "";

    const patternRepeat = watch("pattern_repeat");

    const patternType = watch("pattern_type");

    useMemo(() => {
      if (companyId) {
        replace(defaultValues.configurations ?? []);
      }
    }, [companyId]);

    const getPeriodLabel = (
      index: number,
      patternRepeat: number,
      type: string
    ) => {
      const label = type === "monthly" ? "Month" : "Week";

      const start = index * patternRepeat + 1;

      const end = start + patternRepeat - 1;

      return patternRepeat > 1
        ? `${label} ${start}-${end}`
        : `${label} ${start}`;
    };

    const handleRemoveRow = (index: number) => {
      remove(index);
    };

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            pattern_type: true,
            pattern_repeat: true,
          });

          if (formValues.configurations) {
            filterFormValues.configurations = formValues.configurations.flatMap(
              // eslint-disable-next-line sonarjs/no-nested-functions
              (config) =>
                typeof config === "string" ? config : (config?.shift ?? [])
            );
          }

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="20px">
        <FormProvider {...methods}>
          <FormRow maxColumn={2}>
            <CompanyAutocomplete
              loading={loading}
              control={control}
              error={!!errors.company_id}
              disabled={!!defaultValues.company_id}
              helperText={errorMessages(errors.company_id?.message)}
              name="company_id"
              required
            />

            <TextField
              label="Bank Shift Pattern Name"
              name="bank_shift_pattern_name"
              loading={loading}
              required
              control={control}
              disabled={!!defaultValues.bank_shift_pattern_name}
              error={!!errors.bank_shift_pattern_name}
              helperText={errorMessages(
                errors.bank_shift_pattern_name?.message
              )}
            />

            <TextField
              label="Description"
              name="description"
              loading={loading}
              control={control}
              disabled={disabled}
              error={!!errors.description}
              helperText={errorMessages(errors.description?.message)}
            />
          </FormRow>

          <FormRow>
            <PatternTypeAutocomplete
              label="Bank Shift Pattern Type"
              name="pattern_type"
              control={control}
              disableClearable
              loading={loading}
              error={!!errors.pattern_type}
              helperText={errorMessages(errors.pattern_type?.message)}
              required
              disabled={disabled}
            />
          </FormRow>

          <Typography variant="subtitle1" fontWeight={500}>
            Bank Shift Pattern Changes
          </Typography>

          <Stack gap="10px" alignItems="center" direction="row">
            <Typography>Every</Typography>

            {!loading ? (
              <PatternRepeatAutocomplete
                name="pattern_repeat"
                placeholder="Hours"
                loading={loading}
                control={control}
                disableClearable
                hideLabel
                disabled={disabled}
                error={!!errors.pattern_repeat}
                helperText={errorMessages(errors.pattern_repeat?.message)}
                sx={{ width: "100%", maxWidth: "150px" }}
              />
            ) : (
              <MuiSkeleton
                height="40px"
                sx={{ width: "100%", maxWidth: "150px", transform: "scale(1)" }}
              />
            )}

            <Typography>
              {patternType === "monthly" ? "Months" : "Weeks"}
            </Typography>
          </Stack>

          <Typography variant="subtitle1" fontWeight={500}>
            Define Bank Shift Pattern
          </Typography>

          <Stack
            gap="15px"
            padding="15px"
            sx={{
              border: `1px solid ${iron[700]}`,
              borderRadius: "5px",
              width: "60%",
            }}
          >
            {fields.map((field, index) => (
              <Grid container spacing={2} key={field.id}>
                <Grid gap="5px" item xs={3}>
                  <Typography>
                    {getPeriodLabel(index, patternRepeat, patternType)}
                  </Typography>
                </Grid>

                <Grid gap="5px" item xs={8}>
                  <BankShiftSchemaAutocomplete
                    name={`configurations.${index}.shift`}
                    placeholder="Select Bank Shift"
                    hideLabel
                    control={control}
                    disableClearable
                    loading={loading}
                    companyId={companyId}
                    disabled={!companyId || disabled}
                    error={
                      Array.isArray(errors.configurations) &&
                      errors.configurations[index]?.shift !== undefined
                    }
                    helperText={
                      Array.isArray(errors.configurations) &&
                      errors.configurations[index]?.shift?.message &&
                      errorMessages(errors.configurations[index].shift.message)
                    }
                  />
                </Grid>

                <Grid gap="5px" item xs={1}>
                  <DeleteAction
                    onClick={() => handleRemoveRow(index)}
                    disabled={fields.length <= 2 || disabled}
                  />
                </Grid>
              </Grid>
            ))}

            <PadBox padding={{ padding: "5px" }}>
              <Divider>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() =>
                    append({
                      shift: null,
                    })
                  }
                  disabled={!companyId || disabled}
                  sx={{ width: "fit-content" }}
                >
                  Add New
                </Button>
              </Divider>
            </PadBox>

            {!disabled && fields.length < 2 && (
              <Alert severity="error" sx={{ my: 2 }}>
                <Typography variant="body1" fontWeight={500}>
                  At least Two Shifts Should Be Defined
                </Typography>
              </Alert>
            )}
          </Stack>
        </FormProvider>
      </Stack>
    );
  }
);

BankShiftPatternForm.displayName = "BankShiftPatternForm";
