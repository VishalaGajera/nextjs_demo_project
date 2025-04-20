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
import { EMPLOYEE_FAMILY_DETAILS } from "../constant";
import { hasFormErrors } from "../helper";
import type { AddBulkDataUploadApiPayload } from "../hooks/useAddBulkDataUpload";
import {
  type FamilyDetailsFormFieldValues,
  useAddFamilyDetailsPreviewColumns,
} from "./hooks/useAddFamilyDetailsPreviewColumns";

type AddFamilyDetailsPreviewListProps = Readonly<{
  excelRowsData: ExcelRowsData;
  masterCode: ExcelImportData["master_code"];
  excelTemplateId: ExcelImportData["excel_template_id"];
  excelMappedOptions: ExcelMappedOptions;
}>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
  ) => void;
  setError: UseFormSetError<FamilyDetailsFormFieldValues>;
};

export const AddFamilyDetailsPreviewList = forwardRef(
  (
    {
      masterCode,
      excelRowsData,
      excelTemplateId,
      excelMappedOptions,
    }: AddFamilyDetailsPreviewListProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const gridRef = useRef<AgGridReact<ExcelRowsData[number]>>(null);

    const { column, form, setError } = useAddFamilyDetailsPreviewColumns({
      excelRowsData,
      excelMappedOptions,
    });

    const processFamilyDetailsData = (
      values: FamilyDetailsFormFieldValues,
      onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
    ) => {
      if (values[EMPLOYEE_FAMILY_DETAILS]) {
        const payload = values[EMPLOYEE_FAMILY_DETAILS].map(
          (employeeFamilyDetails) =>
            removeNegationValues({
              ...employeeFamilyDetails,
              date_of_birth:
                employeeFamilyDetails.date_of_birth &&
                DateTime.fromISO(
                  employeeFamilyDetails.date_of_birth
                ).toISODate(),
            })
        );

        onSubmit({ bulk_data: payload });
      } else {
        toasts.error({
          title: "Employee family data is missing.",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      async submitForm(onSubmit) {
        const handleFormSubmit: SubmitHandler<FamilyDetailsFormFieldValues> = (
          values
        ) => {
          if (hasFormErrors({ form })) {
            return;
          }

          if (!excelTemplateId && !masterCode) {
            return;
          }

          processFamilyDetailsData(values, onSubmit);
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

AddFamilyDetailsPreviewList.displayName = "AddFamilyDetailsPreviewList";
