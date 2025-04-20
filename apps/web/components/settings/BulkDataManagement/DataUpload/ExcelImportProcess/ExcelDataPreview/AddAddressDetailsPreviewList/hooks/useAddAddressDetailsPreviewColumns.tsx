import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import {
  submitButtonId,
  useEnableDisableButtonToggle,
} from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import { useGetCountry } from "../../../../../../../../hooks/useGetCountry";
import type { AgColumnsWithActions } from "../../../../../../../../types/agGrid";
import type { OptionsType } from "../../../../../../../../types/options";
import type {
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../../ExcelImportProcess";
import type { ValidationSchema } from "../../common/AddEmployeeSchema";
import { createDynamicZodSchema } from "../../common/AddEmployeeSchema";
import { AutocompleteCellRenderer } from "../../common/AutocompleteCellRenderer";
import { PhoneInputFieldCellRenderer } from "../../common/PhoneInputFieldCellRenderer";
import { TextCellRenderer } from "../../common/TextCellRenderer";
import { EMPLOYEE_ADDRESS_DETAILS } from "../../constant";
import { useUpdateFormValues } from "../../hooks/useUpdateFormValues";
import { CityAutocomplete } from "../CityAutocomplete";
import AddressDetailsFormSchema from "../config.json";
import { StateAutocomplete } from "../StateAutocomplete";

type UseAddAddressDetailsPreviewColumnsArgs = {
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  AddressDetailsFormSchema as ValidationSchema,
  EMPLOYEE_ADDRESS_DETAILS
);

export type AddressDetailsFormFieldValues = z.infer<typeof schema>;

export const useAddAddressDetailsPreviewColumns = ({
  excelRowsData,
  excelMappedOptions,
}: UseAddAddressDetailsPreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<AddressDetailsFormFieldValues>({
    values: {
      [EMPLOYEE_ADDRESS_DETAILS]: excelRowsData as [{ [key: string]: unknown }],
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

  const addressTypeOptions = [
    { label: "Present", value: "present" },
    { label: "Permanent", value: "permanent" },
  ];

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
      masterCodeKey: EMPLOYEE_ADDRESS_DETAILS,
    },
  };

  const { data: countryOptions = [], isFetching: countryLoading } =
    useGetCountry();

  const getError = (index: number, fieldName: string) => {
    return errors[EMPLOYEE_ADDRESS_DETAILS]?.[index]?.[fieldName];
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: EMPLOYEE_ADDRESS_DETAILS,
    options: addressTypeOptions,
    field: "address_type",
  });

  useUpdateFormValues({
    excelRowsData,
    watch,
    setValue,
    masterCodeKey: EMPLOYEE_ADDRESS_DETAILS,
    options: countryOptions,
    loading: countryLoading,
    field: "country_id",
  });

  const optionsMap: Record<string, OptionsType[]> = {
    address_type: addressTypeOptions,
    country_id: countryOptions,
  };

  const getOptions = (type: string) => optionsMap[type] || [];

  const column: AgColumnsWithActions<ExcelRowsData[number]> = excelMappedOptions
    .map((column) => {
      if (column.field_type === "auto_complete") {
        if (column.value === "state_id") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: StateAutocomplete,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                fieldName: column.value,
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                disabled: !watch(
                  `${EMPLOYEE_ADDRESS_DETAILS}.${node.rowIndex ?? 0}.country_id`
                ),
                watch,
                setValue,
                loading: countryLoading,
              };
            },
          };
        } else if (column.value === "city_id") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: CityAutocomplete,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                fieldName: column.value,
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                disabled: !watch(
                  `${EMPLOYEE_ADDRESS_DETAILS}.${node.rowIndex ?? 0}.state_id`
                ),
                watch,
                setValue,
                loading: countryLoading,
              };
            },
          };
        }

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
      } else if (column.field_type === "phone_input_field") {
        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
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
