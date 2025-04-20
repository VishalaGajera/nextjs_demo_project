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
import { SUB_CASTE } from "../constant";
import { hasFormErrors } from "../helper";
import type { AddBulkDataUploadApiPayload } from "../hooks/useAddBulkDataUpload";
import {
  type SubCasteFormFieldValues,
  useAddSubCastePreviewColumns,
} from "./hooks/useAddSubCastePreviewColumns";

type AddSubCastePreviewListProps = Readonly<{
  excelRowsData: ExcelRowsData;
  masterCode: ExcelImportData["master_code"];
  excelTemplateId: ExcelImportData["excel_template_id"];
  excelMappedOptions: ExcelMappedOptions;
}>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
  ) => void;
  setError: UseFormSetError<SubCasteFormFieldValues>;
};

export const AddSubCastePreviewList = forwardRef(
  (
    {
      masterCode,
      excelRowsData,
      excelTemplateId,
      excelMappedOptions,
    }: AddSubCastePreviewListProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const gridRef = useRef<AgGridReact<ExcelRowsData[number]>>(null);

    const { column, form, setError } = useAddSubCastePreviewColumns({
      excelRowsData,
      excelMappedOptions,
    });

    const processSubCasteData = (
      values: SubCasteFormFieldValues,
      onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
    ) => {
      if (values[SUB_CASTE]) {
        const payload = values[SUB_CASTE].map((subCaste) =>
          removeNegationValues(subCaste)
        );

        onSubmit({ bulk_data: payload });
      } else {
        toasts.error({
          title: "Sub Caste data is missing.",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      async submitForm(onSubmit) {
        const handleFormSubmit: SubmitHandler<SubCasteFormFieldValues> = (
          values
        ) => {
          if (hasFormErrors({ form })) {
            return;
          }

          if (!excelTemplateId && !masterCode) {
            return;
          }

          processSubCasteData(values, onSubmit);
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

AddSubCastePreviewList.displayName = "AddSubCastePreviewList";
