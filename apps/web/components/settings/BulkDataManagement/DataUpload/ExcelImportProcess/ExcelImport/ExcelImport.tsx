import {
  Button,
  Card,
  FileNames,
  FileUpload,
  FormContainer,
  FormRow,
  FormSection,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Stack, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { every, isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { excelTemplateKeys } from "../../../../../../queryKeysFactories/excelTemplate";
import {
  readExcelFile,
  type ExcelData,
} from "../../../../../../utils/readExcelFile";
import { ExcelTemplateAutoComplete } from "../../../../../common/Autocomplete/ExcelTemplateAutoComplete";
import type { Options } from "../../../../../common/Autocomplete/hooks/useGetExcelTemplateOptions";
import { EXCEL_FIELD_MAPPING, type OptionKey } from "../constant/constant";
import type { ExcelImportData } from "../ExcelImportProcess";
import { ExcelFieldList } from "./ExcelFieldList";
import { useGetAllExcelTemplateFields } from "./hooks/useGetAllExcelTemplateFields";
import { useGetGenerateExcel } from "./hooks/useGetGenerateExcel";

const excelFileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const ExcelImportSchema = z
  .object({
    excel_template_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    excel_file: z.instanceof(File).nullable(),
  })
  .superRefine((val, ctx) => {
    if (val.excel_template_id && !val.excel_file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["excel_file"],
      });
    }
  });

export type ExcelImportValues = z.infer<typeof ExcelImportSchema>;

type ExcelImportProps = Readonly<{
  setCurrentStep: (value: OptionKey) => void;
  setExcelImportData: (value: ExcelImportData) => void;
  defaultValues: ExcelImportData;
}>;

const queryParams = {
  includeCompany: true,
  includeMaster: true,
};

export function ExcelImport({
  setCurrentStep,
  setExcelImportData,
  defaultValues,
}: ExcelImportProps) {
  const { t } = useTranslation();

  const router = useRouter();

  const theme = useTheme();

  const queryClient = useQueryClient();

  const cachedData: Options[] =
    queryClient.getQueryData(excelTemplateKeys.options(queryParams)) ?? [];

  const [excelSheetData, setExcelSheetData] = useState<ExcelData>({
    titles: defaultValues.excel_Data.titles,
    rows: defaultValues.excel_Data.rows,
  });

  const [expandMore, setExpandMore] = useState(true);

  const initialValues = useMemo(() => {
    if (defaultValues?.excel_Data) {
      setExcelSheetData(defaultValues.excel_Data);
    }

    const { excel_template_id, excel_file } = defaultValues;

    return {
      excel_template_id,
      excel_file,
    };
  }, [defaultValues]);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    values: initialValues,
    resolver: zodResolver(ExcelImportSchema),
    mode: "all",
  });

  const excelTemplateId = watch("excel_template_id");

  const excelFile = watch("excel_file");

  const { data: sampleFile, isPending } = useGetGenerateExcel({
    excelTemplateId: excelTemplateId ?? "",
  });

  const { data: excelFields, isFetching: excelFieldsPending } =
    useGetAllExcelTemplateFields({
      excelTemplateId: excelTemplateId ?? "",
    });

  const handleFileChange = async (file: File) => {
    if (excelFileType !== file.type) {
      toasts.error({ title: t("common.excel.fileType.invalid") });
    }
    try {
      const data = await readExcelFile(file);

      const allValuesEmpty = every(data.rows[0], (value) => isEmpty(value));

      if (allValuesEmpty) {
        toasts.error({ title: t("common.excel.dataNotFound") });
      }

      setValue("excel_file", !allValuesEmpty ? file : null, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setExcelSheetData(data);
    } catch (error) {
      setExcelSheetData({ titles: [], rows: [] });

      setValue("excel_file", null, { shouldValidate: true });

      window.alert("Error reading Excel file.");

      // eslint-disable-next-line no-console
      console.error("Error reading Excel file:", error);
    }
  };

  // Use for clear excel file when excel template change or clear
  useEffect(() => {
    if (!excelTemplateId || dirtyFields.excel_template_id) {
      setValue("excel_file", null);

      setExcelSheetData({ titles: [], rows: [] });
    }
  }, [excelTemplateId]);

  // Use for get a excel file name
  const names: string[] = useMemo(() => {
    if (excelFile && excelFile instanceof File) {
      return [excelFile.name];
    }

    return [];
  }, [excelFile]);

  const excelTemplate = useMemo(() => {
    return excelTemplateId
      ? cachedData.find(
          (template: Options) => template.value === excelTemplateId
        )
      : null;
  }, [excelTemplateId, cachedData]);

  const downloadSampleFile = () => {
    if (sampleFile && excelTemplate?.label) {
      const blob = new Blob([sampleFile], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);

      link.download = excelTemplate.label.replaceAll(" ", "_");

      link.click();
    }
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const onSubmit: SubmitHandler<ExcelImportValues> = (formValues) => {
    if (excelTemplate) {
      const { excel_template_id, excel_file } = formValues;

      const excelMappedOptions = excelFields.map((field) => {
        return {
          label: field.field_name,
          value: field.db_field_name,
          dataType: field.data_type,
          field_type: field.field_type,
        };
      });

      setExcelImportData({
        company_id: excelTemplate.company_id,
        excel_template_id,
        excel_file,
        excel_Data: { ...excelSheetData, rowsWithMappedColumn: [] },
        excelMappedOptions,
        master_code: excelTemplate.master_code,
        import_log: null,
      });

      setCurrentStep(EXCEL_FIELD_MAPPING);
    }
  };

  return (
    <Card>
      <Stack gap="20px">
        <Stack>
          <Typography variant="subtitle1">Step 1 : Excel Import</Typography>

          <FormContainer>
            <FormSection>
              <FormRow>
                <ExcelTemplateAutoComplete
                  name="excel_template_id"
                  control={control}
                  required
                  queryParams={queryParams}
                  error={!!errors.excel_template_id}
                  helperText={errorMessages(errors.excel_template_id?.message)}
                />
              </FormRow>
            </FormSection>
          </FormContainer>

          <PadBox
            padding={{
              padding: "20px",
              background: theme.palette.app.color.slate[700],
            }}
          >
            <Typography variant="body2">
              Please select excel type from the drop down to upload data from
              excel sheet. You can also search for the excel type by typing few
              characters in the drop down.
            </Typography>
          </PadBox>
        </Stack>

        {excelTemplateId && (
          <>
            <Typography variant="body1">Add Employee Import</Typography>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" gap="20px">
                <Typography variant="body2">
                  Click this link to download a sample Excel File.
                </Typography>

                <Button
                  startIcon={<FileDownloadOutlinedIcon />}
                  onClick={downloadSampleFile}
                  disabled={isPending}
                >
                  Sample File
                </Button>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                gap="5px"
                color="secondary"
                sx={{
                  pr: 3,
                  cursor: "pointer",
                  color: theme.palette.app.color.butterflyBlue[900],
                }}
                onClick={() => setExpandMore(!expandMore)}
              >
                <Typography variant="body1" fontWeight="500">
                  Show Field Info
                </Typography>

                {expandMore ? <ExpandLess /> : <ExpandMore />}
              </Stack>
            </Stack>

            {expandMore && (
              <ExcelFieldList
                loading={excelFieldsPending}
                excelFields={excelFields}
              />
            )}

            <FileUpload
              name="excel_file"
              control={control}
              label="Excel Upload"
              acceptTitle="Supported formates: Only XLS, XLSX files are accepted."
              accept=".xls, .xlsx, .xlsm"
              onChange={(file) => {
                if (file[0]) {
                  handleFileChange(file[0]);
                }
              }}
              fileNames={
                <FileNames
                  names={names}
                  onDelete={() => {
                    setValue("excel_file", null, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    setExcelSheetData({ titles: [], rows: [] });
                  }}
                />
              }
              error={!!errors.excel_file}
              helperText={errorMessages(errors.excel_file?.message)}
            />
          </>
        )}

        <Stack direction="row" justifyContent="end">
          <Stack direction="row" gap="5px">
            <Button
              variant="outlined"
              onClick={() => {
                router.push("/settings/bulk-data-management/data-upload");
              }}
            >
              Cancel
            </Button>

            <Button
              disabled={excelFieldsPending}
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
