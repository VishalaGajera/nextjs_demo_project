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
import type {
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../../ExcelImportProcess";
import type { ValidationSchema } from "../../common/AddEmployeeSchema";
import { createDynamicZodSchema } from "../../common/AddEmployeeSchema";
import { CheckBoxCellRenderer } from "../../common/CheckBoxCellRenderer";
import { DatePickerCellRenderer } from "../../common/DatePickerCellRenderer";
import { TextCellRenderer } from "../../common/TextCellRenderer";
import { HOLIDAY } from "../../constant";
import HolidayFormSchema from "../config.json";

type UseAddHolidayPreviewColumnsArgs = {
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  HolidayFormSchema as ValidationSchema,
  HOLIDAY
);

export type HolidayFormFieldValues = z.infer<typeof schema>;

export const useAddHolidayPreviewColumns = ({
  excelRowsData,
  excelMappedOptions,
}: UseAddHolidayPreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<HolidayFormFieldValues>({
    values: { [HOLIDAY]: excelRowsData as [{ [key: string]: unknown }] },
    resolver: zodResolver(schema),
    mode: "all",
  });

  const {
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
      masterCodeKey: HOLIDAY,
    },
  };

  const getError = (index: number, fieldName: string) => {
    return errors[HOLIDAY]?.[index]?.[fieldName];
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const column: AgColumnsWithActions<ExcelRowsData[number]> = excelMappedOptions
    .map((column) => {
      if (column.field_type === "date_picker") {
        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRenderer: DatePickerCellRenderer,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
              fieldName: column.value,
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
              setError,
            };
          },
        };
      } else if (column.field_type === "check_box") {
        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRenderer: CheckBoxCellRenderer,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
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
