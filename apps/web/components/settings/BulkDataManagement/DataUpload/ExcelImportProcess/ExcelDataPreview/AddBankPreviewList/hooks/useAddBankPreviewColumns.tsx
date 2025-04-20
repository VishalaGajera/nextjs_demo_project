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
import { BANK } from "../../constant";
import BankFormSchema from "../config.json";

type UseAddBankPreviewColumnsArgs = {
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  BankFormSchema as ValidationSchema,
  BANK
);

export type BankFormFieldValues = z.infer<typeof schema>;

export const useAddBankPreviewColumns = ({
  excelRowsData,
  excelMappedOptions,
}: UseAddBankPreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<BankFormFieldValues>({
    values: { [BANK]: excelRowsData as [{ [key: string]: unknown }] },
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
      masterCodeKey: BANK,
    },
  };

  const getError = (index: number, fieldName: string) => {
    return errors[BANK]?.[index]?.[fieldName];
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
