"use client";

import { Card, Stepper } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isEmpty } from "lodash";
import { useMemo, useState, type ReactNode } from "react";
import {
  categories,
  EXCEL_DATA_PREVIEW,
  EXCEL_FIELD_MAPPING,
  EXCEL_IMPORT,
  EXCEL_OVERVIEW,
  type OptionKey,
} from "./constant/constant";
import type { MasterCodeOptionKeys } from "./ExcelDataPreview/constant";
import { ExcelDataPreview } from "./ExcelDataPreview/ExcelDataPreview";
import {
  ExcelFieldMapping,
  type ExcelFieldMappingValues,
} from "./ExcelFieldMapping/ExcelFieldMapping";
import { ExcelImport } from "./ExcelImport/ExcelImport";
import type {
  DataType,
  FieldType,
} from "./ExcelImport/hooks/useGetAllExcelTemplateFields";
import { ExcelOverview } from "./ExcelOverview/ExcelOverview";
import { ImportProcessBreadcrumb } from "./ImportProcessBreadcrumb";

export type ExcelImportData = {
  company_id: string | null;
  excel_template_id: string | null;
  master_code: MasterCodeOptionKeys | null;
  excelMappedOptions: {
    label: string;
    value: string;
    dataType: DataType;
    field_type: FieldType;
  }[];
  excel_Data: {
    titles: string[];
    rows: Record<string, unknown>[];
    rowsWithMappedColumn: Record<string, unknown>[];
  };
  excel_file: File | null;
  import_log: string | null;
};

export type ExcelMappedOptions = ExcelImportData["excelMappedOptions"];

export type ExcelData = ExcelImportData["excel_Data"];

export type ExcelRowsData = ExcelImportData["excel_Data"]["rows"];

export type ExcelTemplate = ExcelImportData["excel_template_id"];

export function ExcelImportProcess() {
  const steps = !isEmpty(categories) ? Object.values(categories) : [];

  const [currentStep, setCurrentStep] = useState<OptionKey>(EXCEL_IMPORT);

  const [excelImportData, setExcelImportData] = useState<ExcelImportData>({
    company_id: null,
    excel_template_id: null,
    master_code: null,
    excel_Data: {
      titles: [],
      rows: [],
      rowsWithMappedColumn: [],
    },
    excelMappedOptions: [],
    excel_file: null,
    import_log: null,
  });

  const [excelFieldMappingValues, setExcelFieldMappingValues] =
    useState<ExcelFieldMappingValues>({
      excelFieldMapping: [],
    });

  const activeStep = useMemo(() => {
    if (!isEmpty(categories)) {
      return (
        Object.keys(categories).findIndex((index) => index === currentStep) ?? 0
      );
    }

    return 0;
  }, [currentStep]);

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    [EXCEL_IMPORT]: (
      <ExcelImport
        setCurrentStep={setCurrentStep}
        setExcelImportData={setExcelImportData}
        defaultValues={excelImportData}
      />
    ),
    [EXCEL_FIELD_MAPPING]: (
      <ExcelFieldMapping
        setCurrentStep={setCurrentStep}
        excelData={excelImportData.excel_Data}
        setExcelImportData={setExcelImportData}
        defaultValues={excelFieldMappingValues}
        setExcelFieldMappingValues={setExcelFieldMappingValues}
        excelMappedOptions={excelImportData.excelMappedOptions}
      />
    ),
    [EXCEL_DATA_PREVIEW]: excelImportData.master_code &&
      excelImportData.excel_template_id && (
        <ExcelDataPreview
          setExcelImportData={setExcelImportData}
          excelMappedOptions={excelImportData.excelMappedOptions}
          excelRowsData={excelImportData.excel_Data.rowsWithMappedColumn}
          companyId={excelImportData.company_id ?? ""}
          excelTemplateId={excelImportData.excel_template_id}
          masterCode={excelImportData.master_code}
          setCurrentStep={setCurrentStep}
        />
      ),
    [EXCEL_OVERVIEW]: excelImportData.import_log && (
      <ExcelOverview importLog={excelImportData.import_log} />
    ),
  };

  return (
    <Stack gap="20px">
      <ImportProcessBreadcrumb />

      <Card>
        <Stepper alternativeLabel activeStep={activeStep} steps={steps} />
      </Card>

      {currentStep && categoryRenderer[currentStep]}
    </Stack>
  );
}
