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
import { SUB_DEPARTMENT } from "../constant";
import { hasFormErrors } from "../helper";
import type { AddBulkDataUploadApiPayload } from "../hooks/useAddBulkDataUpload";
import {
  type SubDepartmentFormFieldValues,
  useAddSubDepartmentPreviewColumns,
} from "./hooks/useAddSubDepartmentPreviewColumns";

type AddSubDepartmentPreviewListProps = Readonly<{
  companyId: string;
  excelRowsData: ExcelRowsData;
  masterCode: ExcelImportData["master_code"];
  excelTemplateId: ExcelImportData["excel_template_id"];
  excelMappedOptions: ExcelMappedOptions;
}>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
  ) => void;
  setError: UseFormSetError<SubDepartmentFormFieldValues>;
};

export const AddSubDepartmentPreviewList = forwardRef(
  (
    {
      companyId,
      masterCode,
      excelRowsData,
      excelTemplateId,
      excelMappedOptions,
    }: AddSubDepartmentPreviewListProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const gridRef = useRef<AgGridReact<ExcelRowsData[number]>>(null);

    const { column, form, setError } = useAddSubDepartmentPreviewColumns({
      companyId,
      excelRowsData,
      excelMappedOptions,
    });

    const processSubDepartmentData = (
      values: SubDepartmentFormFieldValues,
      onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
    ) => {
      if (values[SUB_DEPARTMENT]) {
        const payload = values[SUB_DEPARTMENT].map((subDepartment) =>
          removeNegationValues(subDepartment)
        );

        onSubmit({ bulk_data: payload });
      } else {
        toasts.error({
          title: "Sub Department data is missing.",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      async submitForm(onSubmit) {
        const handleFormSubmit: SubmitHandler<SubDepartmentFormFieldValues> = (
          values
        ) => {
          if (hasFormErrors({ form })) {
            return;
          }

          if (!excelTemplateId && !masterCode) {
            return;
          }

          processSubDepartmentData(values, onSubmit);
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

AddSubDepartmentPreviewList.displayName = "AddSubDepartmentPreviewList";
