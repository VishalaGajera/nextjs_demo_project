import { AgGrid, toasts } from "@codezee/sixtify-brahma";
import type { AgGridReact } from "ag-grid-react";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import type { SubmitHandler, UseFormSetError } from "react-hook-form";
import { removeNegationValues } from "../../../../../../../utils/helper";
import type {
  ExcelImportData,
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../ExcelImportProcess";
import { EMPLOYEE_ADDRESS_DETAILS } from "../constant";
import { hasFormErrors } from "../helper";
import type { AddBulkDataUploadApiPayload } from "../hooks/useAddBulkDataUpload";
import {
  type AddressDetailsFormFieldValues,
  useAddAddressDetailsPreviewColumns,
} from "./hooks/useAddAddressDetailsPreviewColumns";

type AddAddressDetailsPreviewListProps = Readonly<{
  excelRowsData: ExcelRowsData;
  masterCode: ExcelImportData["master_code"];
  excelTemplateId: ExcelImportData["excel_template_id"];
  excelMappedOptions: ExcelMappedOptions;
}>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
  ) => void;
  setError: UseFormSetError<AddressDetailsFormFieldValues>;
};

export const AddAddressDetailsPreviewList = forwardRef(
  (
    {
      masterCode,
      excelRowsData,
      excelTemplateId,
      excelMappedOptions,
    }: AddAddressDetailsPreviewListProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const gridRef = useRef<AgGridReact<ExcelRowsData[number]>>(null);

    const { column, form, setError } = useAddAddressDetailsPreviewColumns({
      excelRowsData,
      excelMappedOptions,
    });

    const processAddressDetailsData = (
      values: AddressDetailsFormFieldValues,
      onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
    ) => {
      if (values[EMPLOYEE_ADDRESS_DETAILS]) {
        const payload = values[EMPLOYEE_ADDRESS_DETAILS].map(
          (employeeAddressDetails) =>
            removeNegationValues(employeeAddressDetails)
        );

        onSubmit({ bulk_data: payload });
      } else {
        toasts.error({
          title: "Employee address data is missing.",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      async submitForm(onSubmit) {
        const handleFormSubmit: SubmitHandler<AddressDetailsFormFieldValues> = (
          values
        ) => {
          if (hasFormErrors({ form })) {
            return;
          }

          if (!excelTemplateId && !masterCode) {
            return;
          }

          processAddressDetailsData(values, onSubmit);
        };

        return form.handleSubmit(handleFormSubmit)();
      },
      setError,
    }));

    return (
      <AgGrid<ExcelRowsData[number]>
        ref={gridRef}
        rowData={excelRowsData}
        columnDefs={column}
        suppressCellFocus={true}
        rowModelType="clientSide"
        height="calc(100vh - 500px)"
      />
    );
  }
);

AddAddressDetailsPreviewList.displayName = "AddAddressDetailsPreviewList";
