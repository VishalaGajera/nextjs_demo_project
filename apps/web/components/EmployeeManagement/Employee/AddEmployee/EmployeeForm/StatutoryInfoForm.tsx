import {
  CheckBox,
  DatePicker,
  FormRow,
  TextField,
} from "@codezee/sixtify-brahma";
import { InputLabel, Stack } from "@mui/material";
import { t } from "i18next";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { esicNoRegex, pfNoRegex, uanRegex } from "../../../../../utils/regex";
import { EPFGroupAutocomplete } from "../../../../common/Autocomplete/EPFGroupAutocomplete";
import { ESICGroupAutocomplete } from "../../../../common/Autocomplete/ESICGroupAutocomplete";
import { TaxRegimeAutoComplete } from "../../../../common/Autocomplete/TaxRegimeAutoComplete";

export const StatutoryInfoFormSchema = z
  .object({
    pf_applicable: z.boolean().optional().nullable(),
    epf_group_id: z.string().optional().nullable(),
    pf_account_no: z.string().optional().nullable(),
    pf_joining_date: z.string().optional().nullable(),
    uan_no: z.string().optional().nullable(),
    esic_applicable: z.boolean().optional().nullable(),
    esic_group_id: z.string().optional().nullable(),
    esic_no: z.string().optional().nullable(),
    esic_joining_date: z.string().optional().nullable(),
    lwf_applicable: z.boolean().optional().nullable(),
    pt_applicable: z.boolean().optional().nullable(),
    tds_applicable: z.boolean().optional().nullable(),
    tax_regime_id: z.string().optional().nullable(),
  })
  .superRefine((values, ctx) => {
    const validationMap = {
      pf_applicable: [
        "epf_group_id",
        "pf_account_no",
        "pf_joining_date",
        "uan_no",
      ],
      esic_applicable: ["esic_group_id", "esic_no", "esic_joining_date"],
      tds_applicable: ["tax_regime_id"],
    };

    Object.entries(validationMap).forEach(([key, fields]) => {
      if (values[key as keyof typeof values]) {
        fields.forEach((field) => {
          if (!values[field as keyof typeof values]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "common.required",
              path: [field],
            });
          }
        });
      }
    });

    if (values.pf_account_no && !pfNoRegex.test(values.pf_account_no)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("common.invalidRegex", { fieldName: "PF Number" }),
        path: ["pf_account_no"],
      });
    }

    if (values.uan_no && !uanRegex.test(values.uan_no)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("common.invalidRegex", { fieldName: "UAN Number" }),
        path: ["uan_no"],
      });
    }

    if (values.esic_no && !esicNoRegex.test(values.esic_no)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("common.invalidRegex", { fieldName: "ESIC Number" }),
        path: ["esic_no"],
      });
    }
  });

export type StatutoryFormFieldValues = z.infer<typeof StatutoryInfoFormSchema>;

type StatutoryInfoFormProps = {
  loading?: boolean;
};
export const StatutoryInfoForm = ({
  loading = false,
}: StatutoryInfoFormProps) => {
  const {
    watch,
    clearErrors,
    control,
    formState: { errors },
  } = useFormContext<StatutoryFormFieldValues>();

  const isPfApplicable = watch("pf_applicable");

  const isEsicApplicable = watch("esic_applicable");

  const isTdsApplicable = watch("tds_applicable");

  useMemo(() => {
    if (!isPfApplicable) {
      clearErrors([
        "epf_group_id",
        "pf_account_no",
        "pf_joining_date",
        "uan_no",
      ]);
    }

    if (!isEsicApplicable) {
      clearErrors(["esic_group_id", "esic_no", "esic_joining_date"]);
    }

    if (!isTdsApplicable) {
      clearErrors(["tax_regime_id"]);
    }
  }, [isPfApplicable, isEsicApplicable, isTdsApplicable]);

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <Stack gap="10px">
      <FormRow>
        <Stack direction="row" gap="10px">
          <CheckBox
            name="pf_applicable"
            control={control}
            loading={loading}
            size="small"
          />

          <InputLabel>PF Applicable</InputLabel>
        </Stack>
      </FormRow>

      {isPfApplicable && (
        <Stack gap="15px">
          <FormRow maxColumn={3}>
            <EPFGroupAutocomplete
              name="epf_group_id"
              control={control}
              required={!!isPfApplicable}
              error={!!errors.epf_group_id}
              helperText={errorMessages(errors.epf_group_id?.message)}
              loading={loading}
            />

            <TextField
              loading={loading}
              label="PF Number"
              name="pf_account_no"
              control={control}
              required={!!isPfApplicable}
              error={!!errors.pf_account_no}
              helperText={errorMessages(errors.pf_account_no?.message)}
            />

            <DatePicker
              name="pf_joining_date"
              loading={loading}
              label="PF Join Date"
              control={control}
              required={!!isPfApplicable}
              error={!!errors.pf_joining_date}
              helperText={errorMessages(errors.pf_joining_date?.message)}
            />
          </FormRow>

          <FormRow>
            <TextField
              label="UAN Number"
              name="uan_no"
              control={control}
              required={!!isPfApplicable}
              error={!!errors.uan_no}
              helperText={errorMessages(errors.uan_no?.message)}
              loading={loading}
            />
          </FormRow>
        </Stack>
      )}

      <FormRow>
        <Stack direction="row" gap="10px">
          <CheckBox
            name="esic_applicable"
            control={control}
            loading={loading}
            size="small"
          />

          <InputLabel>ESIC Applicable</InputLabel>
        </Stack>
      </FormRow>

      {isEsicApplicable && (
        <FormRow>
          <ESICGroupAutocomplete
            name="esic_group_id"
            control={control}
            required={!!isEsicApplicable}
            error={!!errors.esic_group_id}
            helperText={errorMessages(errors.esic_group_id?.message)}
            loading={loading}
          />

          <TextField
            label="ESIC Number"
            name="esic_no"
            control={control}
            required={!!isEsicApplicable}
            error={!!errors.esic_no}
            helperText={errorMessages(errors.esic_no?.message)}
            loading={loading}
          />

          <DatePicker
            loading={loading}
            label="ESIC Join Date"
            control={control}
            name="esic_joining_date"
            required={!!isEsicApplicable}
            error={!!errors.esic_joining_date}
            helperText={errorMessages(errors.esic_joining_date?.message)}
          />
        </FormRow>
      )}

      <FormRow>
        <Stack direction="row" gap="10px">
          <CheckBox
            name="tds_applicable"
            control={control}
            loading={loading}
            size="small"
          />

          <InputLabel>TDS Applicable</InputLabel>
        </Stack>
      </FormRow>

      {isTdsApplicable && (
        <FormRow>
          <TaxRegimeAutoComplete
            name="tax_regime_id"
            control={control}
            required={!!isTdsApplicable}
            error={!!errors.tax_regime_id}
            helperText={errorMessages(errors.tax_regime_id?.message)}
            loading={loading}
          />
        </FormRow>
      )}

      <FormRow>
        <Stack direction="row" gap="10px">
          <CheckBox
            name="pt_applicable"
            control={control}
            loading={loading}
            size="small"
          />

          <InputLabel>PT Applicable</InputLabel>
        </Stack>
      </FormRow>

      <FormRow>
        <Stack direction="row" gap="10px">
          <CheckBox
            name="lwf_applicable"
            control={control}
            loading={loading}
            size="small"
          />

          <InputLabel>LWF Applicable</InputLabel>
        </Stack>
      </FormRow>
    </Stack>
  );
};
