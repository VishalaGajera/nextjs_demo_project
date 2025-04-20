import {
  DatePicker,
  FormContainer,
  FormRow,
  FormSection,
  PhoneInputField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { dateDaysPlus, getAgeCalculate } from "../../../../../utils/date";
import { filterChangedFormFields } from "../../../../../utils/helper";
import { isValidMobileNumber } from "../../../../../utils/mobileNumberValidate";
import { emailRegex } from "../../../../../utils/regex";
import { GenderAutocomplete } from "../../../../common/Autocomplete/GenderAutoComplete";
import { TitleSchema } from "../../../../common/Autocomplete/hooks/useGetTitleOptions";
import { TitleAutocomplete } from "../../../../common/Autocomplete/TitleAutocomplete";
import { ImageUploadField } from "../../../../common/ImageUploadField";

const EmployeeBasicDetailsFormSchema = z
  .object({
    title: TitleSchema.optional().nullable(),
    first_name: z
      .string()
      .max(50, "employee.name.maxLength")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    middle_name: z.string().max(50, "employee.name.maxLength").nullable(),
    last_name: z
      .string()
      .max(50, "employee.name.maxLength")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    avatar: z.string().optional().nullable(),
    designation_id: z.string().nullable().nullable(),
    punch_code: z.string().optional().nullable(),
    joining_date: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    mobile_no: z
      .string()
      .refine(isValidMobileNumber, {
        message: "common.mobileNumber.invalid",
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    alternate_mobile_no: z
      .string()
      .refine(isValidMobileNumber, {
        message: "common.mobileNumber.invalid",
      })
      .nullable()
      .optional(),
    email: z
      .string()
      .trim()
      .regex(emailRegex, "common.email.invalid")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    date_of_birth: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    age: z.string().optional().nullable(),
    nick_name: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    on_book_joining_date: z.string().nullable().nullable(),
    probation_period: z
      .number()
      .int("common.probationPeriodDecimalNumaberNotAllow.message")
      .max(1000, "common.probationPeriodLimitation.message")
      .nullable(),
    confirmation_date: z.string().nullable(),
  })
  .superRefine((val, ctx) => {
    if (val.joining_date && val.probation_period === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["probation_period"],
      });
    }
  });

export type EmployeeBasicDetailsFormFieldValues = z.infer<
  typeof EmployeeBasicDetailsFormSchema
>;

type EmployeeBasicDetailsFormProps = {
  defaultValues?: EmployeeBasicDetailsFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<EmployeeBasicDetailsFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<EmployeeBasicDetailsFormFieldValues>;
};

const formDefaultValues: EmployeeBasicDetailsFormFieldValues = {
  title: null,
  first_name: null,
  middle_name: null,
  last_name: null,
  avatar: null,
  designation_id: null,
  punch_code: null,
  joining_date: null,
  mobile_no: null,
  alternate_mobile_no: null,
  email: null,
  date_of_birth: null,
  age: null,
  nick_name: null,
  gender: null,
  on_book_joining_date: null,
  probation_period: null,
  confirmation_date: null,
};

export const EmployeeBasicDetailsForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: EmployeeBasicDetailsFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      watch,
      control,
      setError,
      clearErrors,
      formState: { errors, dirtyFields },
      handleSubmit,
      setValue: setFieldValue,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(EmployeeBasicDetailsFormSchema),
      mode: "all",
    });

    const alternateMobileNo = watch("alternate_mobile_no");

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            {
              ...formValues,
              alternate_mobile_no: alternateMobileNo ? alternateMobileNo : null,
            },
            {
              ...dirtyFields,
              probation_period: false,
              alternate_mobile_no: defaultValues.alternate_mobile_no
                ? dirtyFields.alternate_mobile_no
                : !!alternateMobileNo,
            }
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const joiningDate = watch("joining_date");

    const dateOfBirthDate = watch("date_of_birth");

    const probationPeriod = watch("probation_period");

    const onBookJoiningDate = watch("on_book_joining_date");

    const confirmationDate = watch("confirmation_date");

    useEffect(() => {
      if (joiningDate && typeof probationPeriod === "number") {
        const confirmation = dateDaysPlus(joiningDate, probationPeriod);

        setFieldValue("confirmation_date", confirmation, {
          shouldDirty: true,
        });
      } else if (joiningDate && confirmationDate) {
        setFieldValue("confirmation_date", null, {
          shouldDirty: true,
        });
      }

      setFieldValue(
        "age",
        dateOfBirthDate ? getAgeCalculate(dateOfBirthDate) : null
      );
    }, [joiningDate, probationPeriod, dateOfBirthDate]);

    useEffect(() => {
      if (!joiningDate) {
        setFieldValue("confirmation_date", null);

        setFieldValue("on_book_joining_date", null);

        setFieldValue("probation_period", null);

        clearErrors("probation_period");
      }
    }, [joiningDate]);

    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      joining_date,
      on_book_joining_date,
      probation_period,
      email,
      mobile_no,
      alternate_mobile_no,
    } = errors;

    return (
      <FormContainer>
        <FormSection title="Basic Details">
          <ImageUploadField
            variant="circle"
            name="avatar"
            control={control}
            isCapture={true}
            loading={loading}
          />

          <FormRow>
            <TitleAutocomplete
              name="title"
              control={control}
              loading={loading}
            />

            <TextField
              name="first_name"
              control={control}
              label="First Name"
              required
              characterType="string"
              setError={setError}
              error={!!first_name}
              loading={loading}
              helperText={errorMessages(first_name?.message)}
            />

            <TextField
              name="middle_name"
              control={control}
              label="Middle Name"
              characterType="string"
              setError={setError}
              error={!!middle_name}
              loading={loading}
              helperText={errorMessages(middle_name?.message)}
            />
          </FormRow>

          <FormRow>
            <TextField
              name="last_name"
              control={control}
              label="Last Name"
              required
              characterType="string"
              setError={setError}
              error={!!last_name}
              loading={loading}
              helperText={errorMessages(last_name?.message)}
            />

            <TextField
              control={control}
              label="Nick Name"
              name="nick_name"
              loading={loading}
            />
            <TextField
              control={control}
              label="Punch Code"
              name="punch_code"
              loading={loading}
            />
          </FormRow>

          <FormRow>
            <DatePicker
              name="date_of_birth"
              setError={setError}
              control={control}
              label="Date of Birth"
              required
              maxDate={
                joiningDate ? DateTime.fromISO(joiningDate) : DateTime.now()
              }
              error={!!date_of_birth}
              loading={loading}
              helperText={errorMessages(date_of_birth?.message)}
            />

            <TextField
              control={control}
              loading={loading}
              label="Age"
              name="age"
              disabled
            />

            <GenderAutocomplete
              name="gender"
              control={control}
              loading={loading}
            />
          </FormRow>

          <FormRow>
            <DatePicker
              setError={setError}
              name="joining_date"
              control={control}
              label="Date Of Joining"
              minDate={
                dateOfBirthDate ? DateTime.fromISO(dateOfBirthDate) : undefined
              }
              maxDate={
                onBookJoiningDate
                  ? DateTime.fromISO(onBookJoiningDate)
                  : undefined
              }
              required
              error={!!joining_date}
              loading={loading}
              helperText={errorMessages(joining_date?.message)}
            />

            <DatePicker
              setError={setError}
              name="on_book_joining_date"
              control={control}
              disabled={!joiningDate}
              label="ON Books Join Date"
              minDate={joiningDate ? DateTime.fromISO(joiningDate) : undefined}
              error={!!on_book_joining_date}
              helperText={errorMessages(on_book_joining_date?.message)}
              loading={loading}
            />

            <TextField
              type="number"
              required
              control={control}
              label="Probation Period (Days)"
              name="probation_period"
              loading={loading}
              disabled={!joiningDate}
              error={!!probation_period}
              helperText={errorMessages(probation_period?.message)}
            />
          </FormRow>

          <FormRow>
            <DatePicker
              control={control}
              name="confirmation_date"
              label="Confirmation Date"
              loading={loading}
              disabled
            />
            <TextField
              name="email"
              control={control}
              label="Email"
              required
              letterCase="lowercase"
              error={!!email}
              helperText={errorMessages(email?.message)}
              loading={loading}
            />
            <PhoneInputField
              control={control}
              label="Mobile Number"
              name="mobile_no"
              required
              error={!!mobile_no}
              helperText={errorMessages(mobile_no?.message)}
              loading={loading}
            />
          </FormRow>

          <FormRow>
            <PhoneInputField
              control={control}
              label="Alternate Mobile Number"
              name="alternate_mobile_no"
              error={!!alternate_mobile_no}
              helperText={errorMessages(alternate_mobile_no?.message)}
              loading={loading}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);

EmployeeBasicDetailsForm.displayName = "EmployeeBasicDetailsForm";
