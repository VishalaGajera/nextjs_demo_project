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
import { useGetCastOptions } from "../../../../../../../common/Autocomplete/hooks/useGetCastOptions";
import type {
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../../ExcelImportProcess";
import type { ValidationSchema } from "../../common/AddEmployeeSchema";
import { createDynamicZodSchema } from "../../common/AddEmployeeSchema";
import { AutocompleteCellRenderer } from "../../common/AutocompleteCellRenderer";
import { TextCellRenderer } from "../../common/TextCellRenderer";
import { SUB_CASTE } from "../../constant";
import { useUpdateFormValues } from "../../hooks/useUpdateFormValues";
import SubCasteFormSchema from "../config.json";

type UseAddSubCastePreviewColumnsArgs = {
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  SubCasteFormSchema as ValidationSchema,
  SUB_CASTE
);

export type SubCasteFormFieldValues = z.infer<typeof schema>;

export const useAddSubCastePreviewColumns = ({
  excelRowsData,
  excelMappedOptions,
}: UseAddSubCastePreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<SubCasteFormFieldValues>({
    values: { [SUB_CASTE]: excelRowsData as [{ [key: string]: unknown }] },
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

  const { casteOption } = useGetCastOptions();

  useEnableDisableButtonToggle({
    errors,
    isFormChanged: true,
    buttonId: submitButtonId,
  });

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: SUB_CASTE,
    options: casteOption,
    field: "caste_name",
  });

  const defaultColumnField = {
    minWidth: 240,
    autoHeight: true,
    cellRenderer: TextCellRenderer,
    cellRendererParams: {
      control,
      masterCodeKey: SUB_CASTE,
    },
  };

  const getError = (index: number, fieldName: string) => {
    return errors[SUB_CASTE]?.[index]?.[fieldName];
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

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
              options: casteOption,
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
