import { Autocomplete, FormRow } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import {
  aadharCardRegex,
  licenseNumberRegex,
  panCardRegex,
  voterIdRegex,
} from "../../../../../../utils/regex";
import { BloodTypeSchema } from "../../../../../common/Autocomplete/hooks/useGetBloodGroupOption";
import { AadharCardForm } from "./AadharCardForm";
import { AddDocumentsForm } from "./AddDocumentsForm";
import { DegreeAndCertificateForm } from "./DegreeAndCertificateForm";
import { DrivingLicenseForm } from "./DrivingLicenseForm";
import { PanCardForm } from "./PanCardForm";
import { PreviousExperienceForm } from "./PreviousExperienceForm";
import { SignatureForm } from "./SignatureForm";
import { VoterIdForm } from "./VoterIdForm";
import {
  AADHAAR_CARD,
  ADDRESS_PROOF,
  BIRTH_CERTIFICATE,
  DEGREE_AND_CERTIFICATE,
  DRIVING_LICENSE,
  OTHER_BANK_DOCUMENT,
  PAN_CARD,
  PREVIOUS_EXPERIENCE,
  SIGNATURE,
  TIC,
  VOTER_ID,
} from "./hooks/constant";
import type {
  DocumentOptionKey,
  DocumentTypeOptions,
} from "./hooks/useDocumentOptions";
import { DocumentOptions } from "./hooks/useDocumentOptions";

const currentDate = new Date();

export const DocumentFormObj = z.object({
  document_type: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !!(value && DocumentOptions[value as DocumentOptionKey]),
      {
        message: "common.required",
      }
    ),
  name: z.string().trim().optional().nullable(),
  document_no: z.string().trim().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  document_url: z.string().array().optional(),
  address: z.string().trim().optional().nullable(),
  gender: z.string().optional().nullable(),
  blood_group: BloodTypeSchema.optional().nullable(),
  issue_date: z.string().optional().nullable(),
  expiry_date: z.string().optional().nullable(),
  company_name: z.string().trim().optional().nullable(),
  job_title: z.string().trim().optional().nullable(),
  joining_date: z.string().optional().nullable(),
  relieving_date: z.string().optional().nullable(),
  degree: z.string().trim().optional().nullable(),
  branch_name: z.string().trim().optional().nullable(),
  joining_year: z.string().optional().nullable(),
  completion_year: z.string().optional().nullable(),
  cgpa_or_percentage: z.number().optional().nullable(),
  university_or_college: z.string().trim().optional().nullable(),
});

const DocumentFormSchema = DocumentFormObj
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((val, ctx) => {
    const issueDateValue = val.issue_date ? new Date(val.issue_date) : null;

    const expireOnValue = val.expiry_date ? new Date(val.expiry_date) : null;

    if (val.document_type === AADHAAR_CARD) {
      if (!val.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["name"],
        });
      }

      if (!val.document_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["document_no"],
        });
      } else if (!aadharCardRegex.test(val.document_no)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "document.aadhaar_card_no.invalid",
          path: ["document_no"],
        });
      }
    } else if (val.document_type === PAN_CARD) {
      if (!val.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["name"],
        });
      }

      if (!val.document_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["document_no"],
        });
      } else if (!panCardRegex.test(val.document_no)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "document.pan_card_no.invalid",
          path: ["document_no"],
        });
      }
    } else if (val.document_type === VOTER_ID) {
      if (!val.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["name"],
        });
      }

      if (!val.document_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["document_no"],
        });
      } else if (!voterIdRegex.test(val.document_no)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "document.voter_card_no.invalid",
          path: ["document_no"],
        });
      }
    } else if (val.document_type === DRIVING_LICENSE) {
      if (!val.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["name"],
        });
      }

      if (!val.document_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["document_no"],
        });
      } else if (!licenseNumberRegex.test(val.document_no)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "document.driving_license_no.invalid",
          path: ["document_no"],
        });
      }

      if (!val.issue_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["issue_date"],
        });
      } else if (issueDateValue && issueDateValue >= currentDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "document.issue_date.invalid",
          path: ["issue_date"],
        });
      }

      if (!val.expiry_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["expiry_date"],
        });
      } else if (expireOnValue && expireOnValue <= currentDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "document.expiry_date.invalid",
          path: ["expiry_date"],
        });
      }
    } else if (val.document_type === PREVIOUS_EXPERIENCE) {
      if (!val.company_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["company_name"],
        });
      }

      if (!val.job_title) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["job_title"],
        });
      }
    } else if (val.document_type === DEGREE_AND_CERTIFICATE) {
      if (!val.degree) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["degree"],
        });
      }

      if (!val.branch_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["branch_name"],
        });
      }

      if (
        val.cgpa_or_percentage &&
        (val.cgpa_or_percentage <= 0 || val.cgpa_or_percentage > 100)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "document.cgpa_or_percentage.invalid",
          path: ["cgpa_or_percentage"],
        });
      }
    } else if (!val.document_url || val.document_url.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["document_url"],
      });
    }

    if (
      [
        SIGNATURE,
        ADDRESS_PROOF,
        BIRTH_CERTIFICATE,
        TIC,
        OTHER_BANK_DOCUMENT,
      ].includes(val.document_type ?? "") &&
      (!val.name || typeof val.name !== "string")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["name"],
      });
    }
  });

export type DocumentFormFieldValues = z.infer<typeof DocumentFormSchema>;

type DocumentFormProps = {
  defaultValues?: DocumentFormFieldValues;
  documentTypeOptions?: DocumentTypeOptions[];
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<DocumentFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<DocumentFormFieldValues>;
};

const formDefaultValues: DocumentFormFieldValues = {
  document_type: null,
  name: null,
  document_no: null,
  date_of_birth: null,
  document_url: [],
  address: null,
  gender: null,
  blood_group: null,
  issue_date: null,
  expiry_date: null,
  company_name: null,
  job_title: null,
  joining_date: null,
  relieving_date: null,
  degree: null,
  branch_name: null,
  joining_year: null,
  completion_year: null,
  cgpa_or_percentage: null,
  university_or_college: null,
};

export const DocumentForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      documentTypeOptions,
      loading = false,
      disabled = false,
    }: DocumentFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const formMethods = useForm({
      values: defaultValues,
      resolver: zodResolver(DocumentFormSchema),
      mode: "all",
    });

    const {
      watch,
      control,
      formState: { errors },
      reset,
      setValue,
      setError,
      handleSubmit,
    } = formMethods;

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit({ ...formValues });
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const documentTypeValue = watch("document_type");

    useEffect(() => {
      if (documentTypeValue) {
        reset();
        setValue("document_type", documentTypeValue);
      }
    }, [documentTypeValue]);

    const documentFormRenderer: Record<DocumentOptionKey, ReactNode> = {
      [AADHAAR_CARD]: (
        <AadharCardForm
          control={control}
          errors={errors}
          loading={loading}
          disabled={disabled}
          setError={setError}
        />
      ),
      [PAN_CARD]: (
        <PanCardForm
          control={control}
          errors={errors}
          loading={loading}
          disabled={disabled}
          setError={setError}
        />
      ),
      [VOTER_ID]: (
        <VoterIdForm
          control={control}
          errors={errors}
          loading={loading}
          disabled={disabled}
          setError={setError}
        />
      ),
      [DRIVING_LICENSE]: (
        <DrivingLicenseForm
          control={control}
          loading={loading}
          disabled={disabled}
          errors={errors}
          setError={setError}
        />
      ),
      [PREVIOUS_EXPERIENCE]: (
        <PreviousExperienceForm
          control={control}
          loading={loading}
          disabled={disabled}
          errors={errors}
          setError={setError}
        />
      ),
      [DEGREE_AND_CERTIFICATE]: (
        <DegreeAndCertificateForm
          control={control}
          loading={loading}
          disabled={disabled}
          errors={errors}
          setError={setError}
        />
      ),
      [SIGNATURE]: (
        <SignatureForm
          control={control}
          errors={errors}
          loading={loading}
          disabled={disabled}
          setError={setError}
        />
      ),
      [ADDRESS_PROOF]: <AddDocumentsForm disabled={disabled} />,
      [BIRTH_CERTIFICATE]: <AddDocumentsForm disabled={disabled} />,
      [TIC]: <AddDocumentsForm disabled={disabled} />,
      [OTHER_BANK_DOCUMENT]: <AddDocumentsForm disabled={disabled} />,
    };

    return (
      <FormProvider {...formMethods}>
        <Stack gap="16px">
          <FormRow maxColumn={2}>
            <Autocomplete
              name="document_type"
              options={documentTypeOptions ? documentTypeOptions : []}
              control={control}
              required
              loading={loading}
              disabled={defaultValues.document_type ? true : false}
              error={!!errors.document_type}
              helperText={errorMessages(errors.document_type?.message)}
              label="Document Type"
              placeholder="Select Document Type"
            />
          </FormRow>

          {documentTypeValue &&
            documentFormRenderer[documentTypeValue as DocumentOptionKey]}
        </Stack>
      </FormProvider>
    );
  }
);

DocumentForm.displayName = "DocumentForm";
