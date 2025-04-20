import { AgGrid, toasts } from "@codezee/sixtify-brahma";
import type { AgGridReact } from "ag-grid-react";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import type { SubmitHandler, UseFormSetError } from "react-hook-form";
import type {
  ExcelImportData,
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../ExcelImportProcess";
import { EMPLOYEE } from "../constant";
import { hasFormErrors } from "../helper";
import type { AddBulkDataUploadApiPayload } from "../hooks/useAddBulkDataUpload";
import { marshalEmployeePayload } from "./hooks/MarshalAddEmployeeData";
import {
  type EmployeeFormFieldValues,
  useAddEmployeePreviewColumns,
} from "./hooks/useAddEmployeePreviewColumns";

type AddEmployeePreviewListProps = Readonly<{
  companyId: string;
  loading: boolean;
  setLoading: (value: boolean) => void;
  excelRowsData: ExcelRowsData;
  masterCode: ExcelImportData["master_code"];
  excelTemplateId: ExcelImportData["excel_template_id"];
  excelMappedOptions: ExcelMappedOptions;
}>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
  ) => void;
  setError: UseFormSetError<EmployeeFormFieldValues>;
};

export const AddEmployeePreviewList = forwardRef(
  (
    {
      loading,
      companyId,
      setLoading,
      masterCode,
      excelRowsData,
      excelTemplateId,
      excelMappedOptions,
    }: AddEmployeePreviewListProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const gridRef = useRef<AgGridReact<ExcelRowsData[number]>>(null);

    const { column, form, setError } = useAddEmployeePreviewColumns({
      loading,
      setLoading,
      companyId,
      excelRowsData,
      excelMappedOptions,
    });

    const processEmployeeData = (
      values: EmployeeFormFieldValues,
      onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
    ) => {
      if (values[EMPLOYEE]) {
        const payload = marshalEmployeePayload(values[EMPLOYEE]);

        onSubmit({ bulk_data: payload });
      } else {
        toasts.error({
          title: "Employee data is missing.",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      async submitForm(onSubmit) {
        const handleFormSubmit: SubmitHandler<EmployeeFormFieldValues> = (
          values
        ) => {
          if (hasFormErrors({ form })) {
            return;
          }

          if (!excelTemplateId && !masterCode) {
            return;
          }

          processEmployeeData(values, onSubmit);
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

AddEmployeePreviewList.displayName = "AddEmployeePreviewList";
