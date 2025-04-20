import { AgGrid, toasts } from "@codezee/sixtify-brahma";
import type { AgGridReact } from "ag-grid-react";
import { DateTime } from "luxon";
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
import { EMPLOYEE_EDUCATION_DETAILS } from "../constant";
import { hasFormErrors } from "../helper";
import type { AddBulkDataUploadApiPayload } from "../hooks/useAddBulkDataUpload";
import {
  type EducationDetailsFormFieldValues,
  useAddEducationDetailsPreviewColumns,
} from "./hooks/useAddEducationDetailsPreviewColumns";

type AddEducationDetailsPreviewListProps = Readonly<{
  excelRowsData: ExcelRowsData;
  masterCode: ExcelImportData["master_code"];
  excelTemplateId: ExcelImportData["excel_template_id"];
  excelMappedOptions: ExcelMappedOptions;
}>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
  ) => void;
  setError: UseFormSetError<EducationDetailsFormFieldValues>;
};

export const AddEducationDetailsPreviewList = forwardRef(
  (
    {
      masterCode,
      excelRowsData,
      excelTemplateId,
      excelMappedOptions,
    }: AddEducationDetailsPreviewListProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const gridRef = useRef<AgGridReact<ExcelRowsData[number]>>(null);

    const { column, form, setError } = useAddEducationDetailsPreviewColumns({
      excelRowsData,
      excelMappedOptions,
    });

    const processEducationDetailsData = (
      values: EducationDetailsFormFieldValues,
      onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
    ) => {
      if (values[EMPLOYEE_EDUCATION_DETAILS]) {
        const payload = values[EMPLOYEE_EDUCATION_DETAILS].map(
          (employeeEducationDetails) =>
            removeNegationValues({
              ...employeeEducationDetails,
              from_date:
                employeeEducationDetails.from_date &&
                DateTime.fromISO(
                  employeeEducationDetails.from_date
                ).toISODate(),
              to_date:
                employeeEducationDetails.to_date &&
                DateTime.fromISO(employeeEducationDetails.to_date).toISODate(),
            })
        );

        onSubmit({ bulk_data: payload });
      } else {
        toasts.error({
          title: "Employee education data is missing.",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      async submitForm(onSubmit) {
        const handleFormSubmit: SubmitHandler<
          EducationDetailsFormFieldValues
        > = (values) => {
          if (hasFormErrors({ form })) {
            return;
          }

          if (!excelTemplateId && !masterCode) {
            return;
          }

          processEducationDetailsData(values, onSubmit);
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

AddEducationDetailsPreviewList.displayName = "AddEducationDetailsPreviewList";
