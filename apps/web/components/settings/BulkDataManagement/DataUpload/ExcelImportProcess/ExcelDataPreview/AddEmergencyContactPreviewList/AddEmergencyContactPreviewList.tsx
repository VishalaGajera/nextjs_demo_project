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
import { EMPLOYEE_EMERGENCY_CONTACT } from "../constant";
import { hasFormErrors } from "../helper";
import type { AddBulkDataUploadApiPayload } from "../hooks/useAddBulkDataUpload";
import {
  type EmergencyContactFormFieldValues,
  useAddEmergencyContactPreviewColumns,
} from "./hooks/useAddEmergencyContactPreviewColumns";

type AddEmergencyContactPreviewListProps = Readonly<{
  excelRowsData: ExcelRowsData;
  masterCode: ExcelImportData["master_code"];
  excelTemplateId: ExcelImportData["excel_template_id"];
  excelMappedOptions: ExcelMappedOptions;
}>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
  ) => void;
  setError: UseFormSetError<EmergencyContactFormFieldValues>;
};

export const AddEmergencyContactPreviewList = forwardRef(
  (
    {
      masterCode,
      excelRowsData,
      excelTemplateId,
      excelMappedOptions,
    }: AddEmergencyContactPreviewListProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const gridRef = useRef<AgGridReact<ExcelRowsData[number]>>(null);

    const { column, form, setError } = useAddEmergencyContactPreviewColumns({
      excelRowsData,
      excelMappedOptions,
    });

    const processEmergencyContactData = (
      values: EmergencyContactFormFieldValues,
      onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
    ) => {
      if (values[EMPLOYEE_EMERGENCY_CONTACT]) {
        const payload = values[EMPLOYEE_EMERGENCY_CONTACT].map(
          (employeeEmergencyContact) =>
            removeNegationValues(employeeEmergencyContact)
        );

        onSubmit({ bulk_data: payload });
      } else {
        toasts.error({
          title: "Emergency contact data is missing.",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      async submitForm(onSubmit) {
        const handleFormSubmit: SubmitHandler<
          EmergencyContactFormFieldValues
        > = (values) => {
          if (hasFormErrors({ form })) {
            return;
          }

          if (!excelTemplateId && !masterCode) {
            return;
          }

          processEmergencyContactData(values, onSubmit);
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

AddEmergencyContactPreviewList.displayName = "AddEmergencyContactPreviewList";
