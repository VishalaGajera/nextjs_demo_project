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
import type { OptionsType } from "../../../../../../../../types/options";
import { useGetBloodGroupOptions } from "../../../../../../../common/Autocomplete/hooks/useGetBloodGroupOption";
import { useGetGenderOptions } from "../../../../../../../common/Autocomplete/hooks/useGetGenderOptions";
import { useGetNationalityOption } from "../../../../../../../common/Autocomplete/hooks/useGetNationalityOptions";
import { useGetEmergencyRelationshipOptions } from "../../../../../../../common/Autocomplete/hooks/useGetRelationShip/useGetEmergencyRelationshipOptions";
import type {
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../../ExcelImportProcess";
import type { ValidationSchema } from "../../common/AddEmployeeSchema";
import { createDynamicZodSchema } from "../../common/AddEmployeeSchema";
import { AutocompleteCellRenderer } from "../../common/AutocompleteCellRenderer";
import { DatePickerCellRenderer } from "../../common/DatePickerCellRenderer";
import { TextCellRenderer } from "../../common/TextCellRenderer";
import { EMPLOYEE_FAMILY_DETAILS } from "../../constant";
import { useUpdateFormValues } from "../../hooks/useUpdateFormValues";
import FamilyDetailsFormSchema from "../config.json";

type UseAddFamilyDetailsPreviewColumnsArgs = {
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  FamilyDetailsFormSchema as ValidationSchema,
  EMPLOYEE_FAMILY_DETAILS
);

export type FamilyDetailsFormFieldValues = z.infer<typeof schema>;

export const useAddFamilyDetailsPreviewColumns = ({
  excelRowsData,
  excelMappedOptions,
}: UseAddFamilyDetailsPreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<FamilyDetailsFormFieldValues>({
    values: {
      [EMPLOYEE_FAMILY_DETAILS]: excelRowsData as [{ [key: string]: unknown }],
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
      masterCodeKey: EMPLOYEE_FAMILY_DETAILS,
    },
  };

  const { genderOptions } = useGetGenderOptions();

  const { bloodGroupOptions } = useGetBloodGroupOptions();

  const { emergencyRelationOption } = useGetEmergencyRelationshipOptions();

  const { nationalityOption } = useGetNationalityOption();

  const getError = (index: number, fieldName: string) => {
    return errors[EMPLOYEE_FAMILY_DETAILS]?.[index]?.[fieldName];
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: EMPLOYEE_FAMILY_DETAILS,
    options: genderOptions,
    field: "gender",
  });

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: EMPLOYEE_FAMILY_DETAILS,
    options: bloodGroupOptions,
    field: "blood_group",
  });

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: EMPLOYEE_FAMILY_DETAILS,
    options: emergencyRelationOption,
    field: "relation",
  });

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: EMPLOYEE_FAMILY_DETAILS,
    options: nationalityOption,
    field: "nationality",
  });

  const optionsMap: Record<string, OptionsType[]> = {
    gender: genderOptions,
    blood_group: bloodGroupOptions,
    relation: emergencyRelationOption,
    nationality: nationalityOption,
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
      } else if (column.field_type === "date_picker") {
        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRenderer: DatePickerCellRenderer,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
              fieldName: column.value,
              maxDate: DateTime.now(),
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
