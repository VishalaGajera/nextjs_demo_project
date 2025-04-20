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
import type { OptionsType } from "../../../../../../../../types/options";
import { useGetEmergencyRelationshipOptions } from "../../../../../../../common/Autocomplete/hooks/useGetRelationShip/useGetEmergencyRelationshipOptions";
import type {
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../../ExcelImportProcess";
import type { ValidationSchema } from "../../common/AddEmployeeSchema";
import { createDynamicZodSchema } from "../../common/AddEmployeeSchema";
import { AutocompleteCellRenderer } from "../../common/AutocompleteCellRenderer";
import { PhoneInputFieldCellRenderer } from "../../common/PhoneInputFieldCellRenderer";
import { TextCellRenderer } from "../../common/TextCellRenderer";
import { EMPLOYEE_EMERGENCY_CONTACT } from "../../constant";
import { useUpdateFormValues } from "../../hooks/useUpdateFormValues";
import EmergencyContactFormSchema from "../config.json";

type UseAddEmergencyContactPreviewColumnsArgs = {
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  EmergencyContactFormSchema as ValidationSchema,
  EMPLOYEE_EMERGENCY_CONTACT
);

export type EmergencyContactFormFieldValues = z.infer<typeof schema>;

export const useAddEmergencyContactPreviewColumns = ({
  excelRowsData,
  excelMappedOptions,
}: UseAddEmergencyContactPreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<EmergencyContactFormFieldValues>({
    values: {
      [EMPLOYEE_EMERGENCY_CONTACT]: excelRowsData as [
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
      masterCodeKey: EMPLOYEE_EMERGENCY_CONTACT,
    },
  };

  const contactTypeOptions = [
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
  ];

  const { emergencyRelationOption } = useGetEmergencyRelationshipOptions();

  const getError = (index: number, fieldName: string) => {
    return errors[EMPLOYEE_EMERGENCY_CONTACT]?.[index]?.[fieldName];
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: EMPLOYEE_EMERGENCY_CONTACT,
    options: emergencyRelationOption,
    field: "relation",
  });

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: EMPLOYEE_EMERGENCY_CONTACT,
    options: contactTypeOptions,
    field: "contact_type",
  });

  const optionsMap: Record<string, OptionsType[]> = {
    relation: emergencyRelationOption,
    contact_type: contactTypeOptions,
  };

  const getOptions = (type: string) => optionsMap[type] || [];

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
              options: getOptions(column.value),
              fieldName: column.value,
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
            };
          },
        };
      } else if (column.value === "mobile_no") {
        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          minWidth: 200,
          cellRenderer: PhoneInputFieldCellRenderer,
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
