import { Autocomplete, Button, Card } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { dateFormat } from "../../../../../../utils/date";
import {
  EXCEL_DATA_PREVIEW,
  EXCEL_IMPORT,
  type OptionKey,
} from "../constant/constant";
import type {
  ExcelData,
  ExcelImportData,
  ExcelMappedOptions,
} from "../ExcelImportProcess";

const ExcelFieldMappingSchema = z.object({
  excelFieldMapping: z.array(
    z.object({
      excelField: z.string(),
      mappedColumn: z
        .string()
        .nullable()
        .refine((value) => !!value, {
          message: "common.required",
        }),
      firstRecordFields: z.any(),
    })
  ),
});

export type ExcelFieldMappingValues = z.infer<typeof ExcelFieldMappingSchema>;

const formDefaultValues: ExcelFieldMappingValues = {
  excelFieldMapping: [],
};

type ExcelFieldMappingProps = {
  excelData: ExcelData;
  setCurrentStep: (value: OptionKey) => void;
  defaultValues: ExcelFieldMappingValues;
  excelMappedOptions: ExcelMappedOptions;
  setExcelFieldMappingValues: (value: ExcelFieldMappingValues) => void;
  // TODO: manish below type is define for set value using pre method.
  setExcelImportData: React.Dispatch<React.SetStateAction<ExcelImportData>>;
};

export function ExcelFieldMapping({
  excelData,
  defaultValues = formDefaultValues,
  setCurrentStep,
  excelMappedOptions,
  setExcelImportData,
  setExcelFieldMappingValues,
}: Readonly<ExcelFieldMappingProps>) {
  const router = useRouter();

  const { t } = useTranslation();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: defaultValues,
    resolver: zodResolver(ExcelFieldMappingSchema),
    mode: "all",
  });

  const excelFieldMapping = watch("excelFieldMapping");

  const mappedColumnOptions = useMemo(() => {
    if (excelMappedOptions.length && excelData.titles.length) {
      return excelMappedOptions.map((record) => {
        return {
          ...record,
          disabled: excelData.titles.includes(record.label),
        };
      });
    }

    return [];
  }, [excelMappedOptions, excelData.titles]);

  useEffect(() => {
    if (
      excelData.titles.length &&
      excelData.rows.length &&
      mappedColumnOptions.length &&
      !excelFieldMapping.length
    ) {
      const firstRecord = excelData.rows[0];

      const mappingData = excelData.titles.map((title) => {
        return {
          excelField: title,
          mappedColumn:
            excelMappedOptions.find((option) => option.label === title)
              ?.value ?? null,
          firstRecordFields: firstRecord?.[title] ? firstRecord[title] : "-",
        };
      });

      setValue("excelFieldMapping", mappingData);
    }
  }, [excelData, mappedColumnOptions, excelFieldMapping]);

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const onSubmit: SubmitHandler<ExcelFieldMappingValues> = (formValues) => {
    setExcelFieldMappingValues(formValues);

    let snakeCaseKeyValues: Record<string, string>;

    excelMappedOptions.forEach((option) => {
      snakeCaseKeyValues = {
        ...snakeCaseKeyValues,
        [option.value]: option.dataType,
      };
    });

    let fieldValues: Record<string, { fieldName: string; dataType: string }>;

    formValues.excelFieldMapping.forEach((field) => {
      fieldValues = {
        ...fieldValues,
        [field.excelField]: {
          fieldName: field.mappedColumn as string,
          dataType:
            snakeCaseKeyValues[field.mappedColumn as string] ?? "string",
        },
      };
    });

    const updatedExcelData = excelData.rows.map((row) => {
      return Object.entries(row).reduce(
        (acc: Record<string, unknown>, [key, value]) => {
          const fieldInfo = fieldValues[key];

          if (!fieldInfo) {
            return acc;
          } // Skip if the key is not found in fieldValues

          let formattedValue = null;

          if (fieldInfo.dataType === "string") {
            if (value instanceof Date) {
              formattedValue = value.toISOString();
            } else if (typeof value === "string") {
              formattedValue = value.trim() || null;
            } else if (typeof value === "number") {
              formattedValue = value.toString();
            }
          } else if (fieldInfo.dataType === "boolean") {
            formattedValue =
              typeof value === "string"
                ? value.toLowerCase() === "yes"
                : !!value;
          } else if (
            fieldInfo.dataType === "number" &&
            typeof value === "string"
          ) {
            formattedValue = Number(value);
          }

          acc[fieldInfo.fieldName] = formattedValue;

          return acc;
        },
        {}
      );
    });

    setExcelImportData((prev: ExcelImportData) => ({
      ...prev,
      excel_Data: {
        ...prev.excel_Data,
        rowsWithMappedColumn: updatedExcelData,
      },
    }));

    setCurrentStep(EXCEL_DATA_PREVIEW);
  };

  return (
    <Card>
      <Stack gap="20px">
        <Typography variant="subtitle1">
          Step 2 : Excel Field Mapping
        </Typography>

        <Typography variant="body2">
          If your Excel file column titles are different from the suggested
          titles, you need to manually map your columns to the database fields.
        </Typography>

        <Typography variant="body2">
          If you did use the suggested format, the columns are automatically
          mapped to the related field.
        </Typography>

        <Stack gap="5px">
          <Typography variant="body2">
            Fields From Excel: indicates the column headings from the Excel file
          </Typography>

          <Typography variant="body2">
            Mapped To: indicates the actual field names
          </Typography>

          <Typography variant="body2">
            First Record: indicates the first data recorded in the Excel file
          </Typography>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow hover>
                <TableCell>Fields From Excel</TableCell>

                <TableCell>Mapped To</TableCell>

                <TableCell>First Record</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {excelFieldMapping.map((item, index) => (
                <TableRow key={uuidv4()} hover>
                  <TableCell>{item.excelField}</TableCell>

                  <TableCell>
                    <Autocomplete
                      name={`excelFieldMapping.${index}.mappedColumn`}
                      options={mappedColumnOptions}
                      disabled={
                        excelMappedOptions.find(
                          (column) => column.label === item.excelField
                        )
                          ? true
                          : false
                      }
                      control={control}
                      placeholder="Select Column"
                      error={!!errors.excelFieldMapping?.[index]?.mappedColumn}
                      helperText={
                        errors.excelFieldMapping?.[index]?.mappedColumn
                          ? errorMessages(
                              errors.excelFieldMapping[index].mappedColumn
                                ?.message
                            )
                          : undefined
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {item.firstRecordFields instanceof Date
                      ? dateFormat(item.firstRecordFields.toISOString(), true)
                      : item.firstRecordFields}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
              variant="outlined"
              onClick={() => {
                setCurrentStep(EXCEL_IMPORT);
              }}
            >
              Previous
            </Button>

            <Button
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
