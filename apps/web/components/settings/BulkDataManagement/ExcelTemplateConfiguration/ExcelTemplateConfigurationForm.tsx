import {
  Autocomplete,
  CheckBox,
  FormRow,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Divider, InputLabel, Stack, useTheme } from "@mui/material";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useForm, type UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import { CompanyAutocomplete } from "../../../common/Autocomplete/CompanyAutocomplete";
import { useGetExcelMasterOptions } from "../../../common/Autocomplete/hooks/useGetExcelMasterOptions";
import type { ExcelConfigurationPayload } from "./hooks/useAddExcelTemplateConfiguration";
import { useGetExcelMasterFields } from "./hooks/useGetExcelMasterFields";
import { MappedColumnList } from "./MappedColumnList/MappedColumnList";

const ExcelConfigurationFormSchema = z
  .object({
    company_id: z.string().nullable().optional(),
    is_company_required: z.boolean(),
    excel_master_id: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    template_name: z
      .string()
      .trim()
      .max(255, "common.maxLength")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    excel_template_fields: z
      .array(
        z.object({
          id: z.string(),
          field_name: z.string(),
          parent_reference: z.string().nullable(),
          template_field_name: z.string(),
          required: z.boolean(),
          selected: z.boolean(),
        })
      )
      .or(z.array(z.never())),
  })
  .superRefine((val, ctx) => {
    if (!val.company_id && val.is_company_required) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["company_id"],
      });
    }
  });

export type ExcelConfigurationFormFieldValues = z.infer<
  typeof ExcelConfigurationFormSchema
>;

export type ExcelTemplateFields =
  ExcelConfigurationFormFieldValues["excel_template_fields"];

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: ExcelConfigurationPayload) => void
  ) => void;
  setError: UseFormSetError<ExcelConfigurationPayload>;
};

const formDefaultValues: ExcelConfigurationFormFieldValues = {
  company_id: null,
  is_company_required: false,
  excel_master_id: null,
  template_name: null,
  excel_template_fields: [],
};

type ExcelTemplateConfigurationFormProps = {
  defaultValues?: ExcelConfigurationPayload;
  loading?: boolean;
  disabled?: boolean;
};

export const ExcelTemplateConfigurationForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading,
      disabled = false,
    }: ExcelTemplateConfigurationFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const theme = useTheme();

    const { t } = useTranslation();

    const { data: excelMasterOptions } = useGetExcelMasterOptions();

    const initialValues = useMemo(() => {
      if (defaultValues) {
        return {
          ...defaultValues,
          excel_template_fields: [],
          is_company_required: false,
          company_id: defaultValues.company_id ?? null,
        };
      }

      return formDefaultValues;
    }, [defaultValues]);

    const [excelTemplateFieldList, setExcelTemplateFieldList] = useState<
      ExcelConfigurationFormFieldValues["excel_template_fields"]
    >([]);

    const {
      control,
      watch,
      trigger,
      setValue,
      clearErrors,
      setError,
      formState: { errors },
      handleSubmit,
    } = useForm<ExcelConfigurationFormFieldValues>({
      values: initialValues,
      resolver: zodResolver(ExcelConfigurationFormSchema),
      mode: "all",
    });

    const companyId = watch("company_id");

    const excelMasterId = watch("excel_master_id");

    const isCompanyRequired = watch("is_company_required");

    const excelTemplateFields = watch("excel_template_fields");

    const { data: excelMasterFieldsList } = useGetExcelMasterFields({
      excelMasterId: excelMasterId ?? "",
    });

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

    useEffect(() => {
      if (excelMasterFieldsList.length > 0) {
        if (defaultValues.excel_template_fields?.length > 0) {
          const excelMasterFields = excelMasterFieldsList.map((field) => {
            const excelMasterField = defaultValues.excel_template_fields.find(
              (field2) => field.id === field2.id
            );

            return excelMasterField
              ? {
                  ...field,
                  selected: true,
                  template_field_name: field.field_name,
                }
              : {
                  ...field,
                  selected: field.required,
                  template_field_name: field.field_name,
                };
          });

          setValue("excel_template_fields", excelMasterFields);
        } else {
          const excelMasterFields = excelMasterFieldsList.map((field) => {
            return {
              ...field,
              selected: field.required,
              template_field_name: field.field_name,
            };
          });

          setValue("excel_template_fields", excelMasterFields);
        }
      } else if (excelTemplateFields?.length !== 0) {
        setValue("excel_template_fields", []);
      }
    }, [excelMasterFieldsList]);

    useEffect(() => {
      if (excelMasterId && excelMasterOptions.length) {
        const isCompanyRequired =
          excelMasterOptions.find((option) => option.value === excelMasterId)
            ?.is_company_required ?? false;

        setValue("is_company_required", isCompanyRequired);

        if (isCompanyRequired) {
          if (!companyId) {
            trigger("company_id", { shouldFocus: true });
          }
        } else {
          setValue("company_id", null);

          clearErrors("company_id");
        }
      } else {
        setValue("is_company_required", false);

        setValue("company_id", null, {
          shouldValidate: true,
        });
      }
    }, [excelMasterId]);

    const getPayload = (values: ExcelConfigurationFormFieldValues) => {
      const excelTemplateFieldsList = values.excel_template_fields
        .filter((field) => field.selected)
        .map((field) => {
          return {
            id: field.id,
            template_field_name: field.template_field_name,
          };
        });

      return {
        template_name: values.template_name,
        excel_master_id: defaultValues.excel_master_id
          ? undefined
          : values.excel_master_id,
        company_id: defaultValues.company_id
          ? undefined
          : (values.company_id ?? undefined),
        excel_template_fields: excelTemplateFieldsList,
      };
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const payload = getPayload(formValues);

          onSubmit(payload);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    useEffect(() => {
      if (
        excelTemplateFields?.length &&
        JSON.stringify(excelTemplateFields) !==
          JSON.stringify(excelTemplateFieldList)
      ) {
        const excelTemplateFieldsList = excelTemplateFields.map((field) => {
          if (field.parent_reference) {
            const getParentField = excelTemplateFields.find(
              (fieldObj) => fieldObj.field_name === field.parent_reference
            );

            if (getParentField?.selected && !field.selected) {
              return { ...field, required: true, selected: true };
            } else if (!getParentField?.selected && field.selected) {
              return { ...field, required: false, selected: false };
            }

            return field;
          }

          return field;
        });

        setExcelTemplateFieldList(excelTemplateFieldsList);

        setValue("excel_template_fields", excelTemplateFieldsList);
      }
    }, [JSON.stringify(excelTemplateFields)]);

    return (
      <Stack gap="20px">
        <FormRow>
          <Autocomplete
            name="excel_master_id"
            control={control}
            label="Excel Template For"
            placeholder="Select Excel Template For"
            options={excelMasterOptions}
            loading={loading}
            required
            error={!!errors.excel_master_id}
            helperText={errorMessages(errors.excel_master_id?.message)}
            disabled={!!defaultValues.excel_master_id || disabled}
          />

          {isCompanyRequired && (
            <CompanyAutocomplete
              name="company_id"
              control={control}
              required
              loading={loading}
              error={!!errors.company_id}
              helperText={errorMessages(errors.company_id?.message)}
              disabled={!!defaultValues.company_id || disabled}
            />
          )}

          <TextField
            name="template_name"
            control={control}
            label="Excel Template Name"
            required
            loading={loading}
            error={!!errors.template_name}
            helperText={errorMessages(errors.template_name?.message)}
            disabled={disabled}
          />
        </FormRow>

        {excelTemplateFields.length > 0 && (
          <>
            <Divider />

            <Stack direction="row" gap="25px" sx={{ flex: 1 }}>
              <Stack gap="10px" sx={{ width: "400px" }}>
                <InputLabel>Default Field List</InputLabel>

                <Box
                  sx={{
                    border: `1px solid ${theme.palette.app.color.butterflyBlue[300]}`,
                    borderRadius: "6px",
                    maxHeight: "550px",
                    overflowY: "auto",
                  }}
                >
                  <PadBox padding={{ padding: "20px" }}>
                    <Stack gap="10px">
                      {excelTemplateFields.map((field, index) => {
                        return (
                          <Stack key={uuidv4()} direction="row" gap="10px">
                            <span
                              style={{
                                height: "25px",
                                width: "25px",
                                textAlign: "center",
                              }}
                            >
                              {field.required ? (
                                <LockOutlinedIcon color="disabled" />
                              ) : (
                                <CheckBox
                                  name={`excel_template_fields.${index}.selected`}
                                  control={control}
                                  size="small"
                                  disabled={
                                    !!field.parent_reference || disabled
                                  }
                                />
                              )}
                            </span>

                            <InputLabel>{field.field_name}</InputLabel>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </PadBox>
                </Box>
              </Stack>

              <Stack gap="10px" flexGrow={1}>
                <InputLabel>Mapped Column</InputLabel>

                <MappedColumnList
                  disabled={disabled}
                  setValue={setValue}
                  defaultFields={excelTemplateFields}
                />
              </Stack>
            </Stack>
          </>
        )}
      </Stack>
    );
  }
);

ExcelTemplateConfigurationForm.displayName = "ExcelTemplateConfigurationForm";
