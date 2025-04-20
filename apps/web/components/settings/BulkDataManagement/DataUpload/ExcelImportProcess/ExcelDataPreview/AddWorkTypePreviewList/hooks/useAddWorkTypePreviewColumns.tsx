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
import { TextCellRenderer } from "../../common/TextCellRenderer";
import { WORK_TYPE } from "../../constant";
import WorkTypeFormSchema from "../config.json";

type UseAddWorkTypePreviewColumnsArgs = {
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  WorkTypeFormSchema as ValidationSchema,
  WORK_TYPE
);

export type WorkTypeFormFieldValues = z.infer<typeof schema>;

export const useAddWorkTypePreviewColumns = ({
  excelRowsData,
  excelMappedOptions,
}: UseAddWorkTypePreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<WorkTypeFormFieldValues>({
    values: { [WORK_TYPE]: excelRowsData as [{ [key: string]: unknown }] },
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
      masterCodeKey: WORK_TYPE,
    },
  };

  const getError = (index: number, fieldName: string) => {
    return errors[WORK_TYPE]?.[index]?.[fieldName];
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const column: AgColumnsWithActions<ExcelRowsData[number]> = excelMappedOptions
    .map((column) => {
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
