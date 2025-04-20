import {
  FormContainer,
  FormRow,
  FormSection,
  PhoneInputField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography, useTheme } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import { filterNestedChangedFormFields } from "../../../../../../../utils/helper";
import { isValidMobileNumber } from "../../../../../../../utils/mobileNumberValidate";
import { ReferenceEmployeeTypeAutoComplete } from "../../../../../../common/Autocomplete/ReferenceEmployeeTypeAutoComplete";
import { ReferenceTypeAutocomplete } from "../../../../../../common/Autocomplete/ReferenceTypeAutoComplete";
import { useGetEmployeeOption } from "../../../../../../common/Autocomplete/hooks/useGetEmployeeOption";

const ReferenceDetailFormSchema = z.object({
  reference_type: z.string().nullable(),
  reference_employee_id: z.string().nullable(),
  reference_name: z.string().max(255, "common.maxLength").nullable(),
  reference_mobile_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable(),
  reference_address: z.string().max(255, "common.maxLength").nullable(),
});

const ReferenceDetailsFormSchema = z
  .object({
    first: ReferenceDetailFormSchema,
    second: ReferenceDetailFormSchema,
  })
  .superRefine((val, ctx) => {
    if (!val.first.reference_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["first.reference_type"],
      });
    }

    if (!val.first.reference_mobile_no) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["first.reference_mobile_no"],
      });
    }

    if (!val.first.reference_address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["first.reference_address"],
      });
    }
  });

export type ReferenceDetailsFormFieldValues = z.infer<
  typeof ReferenceDetailsFormSchema
>;

type ReferenceDetailsFormProps = {
  defaultValues?: ReferenceDetailsFormFieldValues;
  loading?: boolean;
  companyId: string;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<ReferenceDetailsFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<ReferenceDetailsFormFieldValues>;
};

const formDefaultValues = {
  reference_type: null,
  reference_employee_id: null,
  reference_name: null,
  reference_mobile_no: null,
  reference_address: null,
};

export const ReferenceDetailsForm = forwardRef(
  (
    {
      defaultValues = {
        first: formDefaultValues,
        second: formDefaultValues,
      },
      loading = false,
      companyId,
    }: ReferenceDetailsFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const theme = useTheme();

    const { butterflyBlue } = theme.palette.app.color;

    const {
      watch,
      control,
      setValue,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(ReferenceDetailsFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const secondReferenceMobileNo = watch("second.reference_mobile_no");

    const { data: reportingMemberOptions, isFetching } = useGetEmployeeOption({
      companyId,
      queryParams: {
        mobile_no: true,
        address: true,
      },
    });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(
            {
              ...formValues,
              second: {
                ...formValues.second,
                reference_mobile_no: secondReferenceMobileNo
                  ? secondReferenceMobileNo
                  : null,
              },
            },
            {
              ...dirtyFields,
              first: {
                ...dirtyFields.first,
                reference_name: true,
                reference_employee_id: !formValues.first.reference_name,
              },
              second: {
                ...dirtyFields.second,
                reference_name: true,
                reference_employee_id: !formValues.second.reference_name,
                reference_mobile_no: defaultValues.second.reference_mobile_no
                  ? dirtyFields.second?.reference_mobile_no
                  : !!secondReferenceMobileNo,
              },
            }
          );

          const processedFormValues = { ...filterFormValues };

          const processReferenceFields = (
            section: keyof typeof processedFormValues
            // eslint-disable-next-line sonarjs/no-nested-functions
          ) => {
            if (!processedFormValues[section]) {
              return;
            }

            if (processedFormValues[section].reference_employee_id) {
              processedFormValues[section].reference_name = null;
            }

            if (processedFormValues[section].reference_name) {
              processedFormValues[section].reference_employee_id = null;
            }
          };

          processReferenceFields("first");
          processReferenceFields("second");

          onSubmit(processedFormValues);
        })();
      },
      setError,
    }));

    const referenceFirstEmployeeId = watch("first.reference_employee_id");

    const referenceSecondEmployeeId = watch("second.reference_employee_id");

    useEffect(() => {
      if (referenceFirstEmployeeId) {
        const selectedFirstEmployee = reportingMemberOptions?.find(
          (emp) => referenceFirstEmployeeId === emp.value
        );

        if (selectedFirstEmployee) {
          setValue("first.reference_name", null);
          setValue(
            "first.reference_mobile_no",
            selectedFirstEmployee.mobile_no,
            {
              shouldDirty: true,
            }
          );
          setValue("first.reference_address", selectedFirstEmployee.address, {
            shouldDirty: true,
          });
        }
      }
    }, [referenceFirstEmployeeId]);

    useEffect(() => {
      if (referenceSecondEmployeeId) {
        const selectedSecondEmployee = reportingMemberOptions?.find(
          (emp) => referenceSecondEmployeeId === emp.value
        );

        if (selectedSecondEmployee) {
          setValue("second.reference_name", null);
          setValue(
            "second.reference_mobile_no",
            selectedSecondEmployee.mobile_no,
            {
              shouldDirty: true,
            }
          );
          setValue("second.reference_address", selectedSecondEmployee.address, {
            shouldDirty: true,
          });
        }
      }
    }, [referenceSecondEmployeeId]);

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const {
      reference_type: first_reference_type,
      reference_employee_id: first_reference_employee_id,
      reference_mobile_no: first_reference_mobile_no,
      reference_address: first_reference_address,
    } = errors.first ?? {};

    const {
      reference_employee_id: second_reference_employee_id,
      reference_mobile_no: second_reference_mobile_no,
      reference_address: second_reference_address,
    } = errors.second ?? {};

    return (
      <FormContainer>
        <FormSection>
          <Typography
            variant="body1"
            sx={{
              color: butterflyBlue[900],
            }}
          >
            Reference 1
          </Typography>

          <FormRow maxColumn={2}>
            <ReferenceTypeAutocomplete
              control={control}
              name="first.reference_type"
              loading={loading}
              required
              error={!!first_reference_type}
              helperText={errorMessages(first_reference_type?.message)}
            />

            <ReferenceEmployeeTypeAutoComplete
              name="first.reference_employee_id"
              control={control}
              loading={isFetching}
              options={reportingMemberOptions}
              textFieldName="first.reference_name"
              setValue={setValue}
              required
              error={!!first_reference_employee_id}
              helperText={errorMessages(first_reference_employee_id?.message)}
            />
          </FormRow>

          <FormRow maxColumn={2}>
            <PhoneInputField
              control={control}
              label="Reference Mobile No"
              name="first.reference_mobile_no"
              loading={loading}
              error={!!first_reference_mobile_no}
              helperText={errorMessages(first_reference_mobile_no?.message)}
              required
            />

            <TextField
              control={control}
              label="Reference Address"
              name="first.reference_address"
              loading={loading}
              required
              error={!!first_reference_address}
              helperText={errorMessages(first_reference_address?.message)}
            />
          </FormRow>

          <Typography
            variant="body1"
            sx={{
              color: butterflyBlue[900],
              mt: 2,
            }}
          >
            Reference 2
          </Typography>

          <FormRow maxColumn={2}>
            <ReferenceTypeAutocomplete
              control={control}
              name="second.reference_type"
              loading={loading}
            />

            <ReferenceEmployeeTypeAutoComplete
              name="second.reference_employee_id"
              control={control}
              loading={isFetching}
              options={reportingMemberOptions}
              textFieldName="second.reference_name"
              setValue={setValue}
              error={!!second_reference_employee_id}
              helperText={errorMessages(second_reference_employee_id?.message)}
            />
          </FormRow>

          <FormRow maxColumn={2}>
            <PhoneInputField
              control={control}
              label="Reference Mobile No"
              name="second.reference_mobile_no"
              loading={loading}
              error={!!second_reference_mobile_no}
              helperText={errorMessages(second_reference_mobile_no?.message)}
            />

            <TextField
              control={control}
              label="Reference Address"
              name="second.reference_address"
              loading={loading}
              error={!!second_reference_address}
              helperText={errorMessages(second_reference_address?.message)}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);

ReferenceDetailsForm.displayName = "ReferenceDetailsForm";
