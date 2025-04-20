import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { FormProvider, useForm, type UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../utils/helper";
import { bankAcNoRegex, ifscRegex } from "../../../../utils/regex";
import {
  AccountTypeAutocomplete,
  AccountTypeSchema,
} from "../../../common/Autocomplete/AccountTypeAutoComplete";
import { BankAutocomplete } from "../../../common/Autocomplete/BankAutocomplete";
import {
  PaymentTypeAutocomplete,
  PaymentTypeSchema,
} from "../../../common/Autocomplete/PaymentTypeAutoComplete";
import { CASH } from "../../../common/Autocomplete/hooks/constant";

export const BankInfoFormSchema = z
  .object({
    payment_type: PaymentTypeSchema,
    bank_id: z.string().optional().nullable(),
    branch_name: z.string().optional().nullable(),
    account_type: AccountTypeSchema.optional().nullable(),
    account_no: z.string().optional().nullable(),
    ifsc_code: z.string().optional().nullable(),
    name_as_per_bank: z
      .string()
      .max(50, "name_as_per_bank.maxLength")
      .optional()
      .nullable(),
    effective_from: z.string().nullable().optional(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((val, ctx) => {
    if (val.payment_type === "bank") {
      if (!val.bank_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["bank_id"],
        });
      }

      if (!val.branch_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["branch_name"],
        });
      }

      if (!val.account_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["account_type"],
        });
      }

      if (!val.account_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["account_no"],
        });
      } else if (!bankAcNoRegex.test(val.account_no)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.account_no.invalid",
          path: ["account_no"],
        });
      }

      if (!val.ifsc_code) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["ifsc_code"],
        });
      } else if (!ifscRegex.test(val.ifsc_code)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.ifsc_code.invalid",
          path: ["ifsc_code"],
        });
      }
    }
  });

export type BankInfoFormFieldValues = z.infer<typeof BankInfoFormSchema>;

type BankInfoFormProps = {
  loading?: boolean;
  defaultValues?: BankInfoFormFieldValues;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BankInfoFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<BankInfoFormFieldValues>;
};

const formDefaultValues: BankInfoFormFieldValues = {
  payment_type: CASH,
  bank_id: null,
  branch_name: null,
  account_type: null,
  account_no: null,
  ifsc_code: null,
  name_as_per_bank: null,
};

export const BankInfoForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: BankInfoFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(BankInfoFormSchema),
      mode: "all",
    });

    const {
      watch,
      control,
      setError,
      clearErrors,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    useEnableDisableButton({ control, defaultValues, errors });

    const paymentType = watch("payment_type");

    useMemo(() => {
      if (paymentType !== "bank") {
        clearErrors([
          "bank_id",
          "branch_name",
          "account_type",
          "account_no",
          "ifsc_code",
        ]);
      }
    }, [paymentType]);

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
          });

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="10px">
        <FormProvider {...methods}>
          <FormRow>
            <PaymentTypeAutocomplete
              name="payment_type"
              loading={loading}
              required
              control={control}
              disableClearable
              error={!!errors.payment_type}
              helperText={errorMessages(errors.payment_type?.message)}
            />

            {paymentType === "bank" && (
              <>
                <BankAutocomplete
                  error={!!errors.bank_id}
                  loading={loading}
                  helperText={errorMessages(errors.bank_id?.message)}
                  name="bank_id"
                  control={control}
                  required
                />

                <TextField
                  label="Bank Branch"
                  name="branch_name"
                  loading={loading}
                  control={control}
                  required
                  error={!!errors.branch_name}
                  helperText={errorMessages(errors.branch_name?.message)}
                />
              </>
            )}
          </FormRow>

          {paymentType === "bank" && (
            <>
              <FormRow>
                <AccountTypeAutocomplete
                  name="account_type"
                  loading={loading}
                  control={control}
                  required
                  error={!!errors.account_type}
                  helperText={errorMessages(errors.account_type?.message)}
                />

                <TextField
                  label="Account Number"
                  name="account_no"
                  loading={loading}
                  control={control}
                  required
                  error={!!errors.account_no}
                  helperText={errorMessages(errors.account_no?.message)}
                />

                <TextField
                  label="IFSC Code"
                  name="ifsc_code"
                  isCapitalize
                  loading={loading}
                  control={control}
                  required
                  error={!!errors.ifsc_code}
                  helperText={errorMessages(errors.ifsc_code?.message)}
                />
              </FormRow>

              <FormRow>
                <TextField
                  label="Name As Per Bank"
                  name="name_as_per_bank"
                  control={control}
                  loading={loading}
                  error={!!errors.name_as_per_bank}
                  helperText={errorMessages(errors.name_as_per_bank?.message)}
                />
              </FormRow>
            </>
          )}
        </FormProvider>
      </Stack>
    );
  }
);

BankInfoForm.displayName = "BankInfoForm";
