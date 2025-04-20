import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import {
  submitButtonId,
  useEnableDisableButtonToggle,
} from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import type { AgColumnsWithActions } from "../../../../../../../../types/agGrid";
import { useGetDepartmentOptions } from "../../../../../../../common/Autocomplete/hooks/useGetDepartmentOptions";
import type {
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../../ExcelImportProcess";
import type { ValidationSchema } from "../../common/AddEmployeeSchema";
import { createDynamicZodSchema } from "../../common/AddEmployeeSchema";
import { AutocompleteCellRenderer } from "../../common/AutocompleteCellRenderer";
import { TextCellRenderer } from "../../common/TextCellRenderer";
import { SUB_DEPARTMENT } from "../../constant";
import { useUpdateFormValues } from "../../hooks/useUpdateFormValues";
import SubDepartmentFormSchema from "../config.json";

type UseAddSubDepartmentPreviewColumnsArgs = {
  excelRowsData: ExcelRowsData;
  companyId: string;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  SubDepartmentFormSchema as ValidationSchema,
  SUB_DEPARTMENT
);

export type SubDepartmentFormFieldValues = z.infer<typeof schema>;

export const useAddSubDepartmentPreviewColumns = ({
  companyId,
  excelRowsData,
  excelMappedOptions,
}: UseAddSubDepartmentPreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<SubDepartmentFormFieldValues>({
    values: { [SUB_DEPARTMENT]: excelRowsData as [{ [key: string]: unknown }] },
    resolver: zodResolver(schema),
    mode: "all",
  });

  const {
    watch,
    setValue,
    control,
    setError,
    formState: { errors },
  } = form;

  useEnableDisableButtonToggle({
    errors,
    isFormChanged: true,
    buttonId: submitButtonId,
  });

  const defaultColumnField = {
    minWidth: 240,
    autoHeight: true,
    cellRenderer: TextCellRenderer,
    cellRendererParams: {
      control,
      masterCodeKey: SUB_DEPARTMENT,
    },
  };

  const { data: departmentOptions, isFetching: departmentLoading } =
    useGetDepartmentOptions({
      companyId,
    });

  const getError = (index: number, fieldName: string) => {
    return errors[SUB_DEPARTMENT]?.[index]?.[fieldName];
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: SUB_DEPARTMENT,
    options: departmentOptions,
    field: "department_id",
    loading: departmentLoading,
  });

  const column: AgColumnsWithActions<ExcelRowsData[number]> = excelMappedOptions
    .map((column) => {
      if (column.field_type === "auto_complete") {
        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRenderer: AutocompleteCellRenderer,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
              options: departmentOptions,
              fieldName: column.value,
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
            };
          },
        };
      }

      return {
        ...defaultColumnField,
        headerName: column.label,
        field: column.value,
        cellRendererParams: ({ node }: CustomCellRendererProps) => {
          return {
            ...defaultColumnField.cellRendererParams,
            error: getError(node.rowIndex ?? 0, column.value),
            errorMessage: errorMessages(
              getError(node.rowIndex ?? 0, column.value)?.message as string
            ),
            fieldName: column.value,
          };
        },
      };
    })
    .filter((col) => !!col);

  return { column, form, setError };
};
