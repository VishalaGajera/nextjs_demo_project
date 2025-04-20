import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import {
  submitButtonId,
  useEnableDisableButtonToggle,
} from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import type { AgColumnsWithActions } from "../../../../../../../../types/agGrid";
import { useGeQualificationOption } from "../../../../../../../common/Autocomplete/hooks/useGetQualificationOptions";
import type {
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../../ExcelImportProcess";
import type { ValidationSchema } from "../../common/AddEmployeeSchema";
import { createDynamicZodSchema } from "../../common/AddEmployeeSchema";
import { AutocompleteCellRenderer } from "../../common/AutocompleteCellRenderer";
import { DatePickerCellRenderer } from "../../common/DatePickerCellRenderer";
import { TextCellRenderer } from "../../common/TextCellRenderer";
import { EMPLOYEE_EDUCATION_DETAILS } from "../../constant";
import { useUpdateFormValues } from "../../hooks/useUpdateFormValues";
import EducationDetailsFormSchema from "../config.json";

type UseAddEducationDetailsPreviewColumnsArgs = {
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  EducationDetailsFormSchema as ValidationSchema,
  EMPLOYEE_EDUCATION_DETAILS
);

export type EducationDetailsFormFieldValues = z.infer<typeof schema>;

export const useAddEducationDetailsPreviewColumns = ({
  excelRowsData,
  excelMappedOptions,
}: UseAddEducationDetailsPreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<EducationDetailsFormFieldValues>({
    values: {
      [EMPLOYEE_EDUCATION_DETAILS]: excelRowsData as [
        { [key: string]: unknown },
      ],
    },
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
      masterCodeKey: EMPLOYEE_EDUCATION_DETAILS,
    },
  };

  const { qualificationOptions } = useGeQualificationOption();

  const getError = (index: number, fieldName: string) => {
    return errors[EMPLOYEE_EDUCATION_DETAILS]?.[index]?.[fieldName];
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: EMPLOYEE_EDUCATION_DETAILS,
    options: qualificationOptions,
    field: "qualification",
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
              options: qualificationOptions,
              fieldName: column.value,
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
            };
          },
        };
      } else if (column.field_type === "date_picker") {
        if (column.value === "from_date") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: DatePickerCellRenderer,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                fieldName: column.value,
                minDate: DateTime.now().minus({ years: 100 }),
                maxDate:
                  DateTime.fromISO(
                    watch(
                      `${EMPLOYEE_EDUCATION_DETAILS}.${node.rowIndex ?? 0}.to_date`
                    )
                  ) ?? DateTime.now(),
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                setError,
              };
            },
          };
        }

        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRenderer: DatePickerCellRenderer,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
              fieldName: column.value,
              minDate: DateTime.fromISO(
                watch(
                  `${EMPLOYEE_EDUCATION_DETAILS}.${node.rowIndex ?? 0}.from_date`
                )
              ),
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
              setError,
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
