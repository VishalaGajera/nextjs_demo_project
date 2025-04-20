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
import { HOLIDAY } from "../constant";
import { hasFormErrors } from "../helper";
import type { AddBulkDataUploadApiPayload } from "../hooks/useAddBulkDataUpload";
import {
  type HolidayFormFieldValues,
  useAddHolidayPreviewColumns,
} from "./hooks/useAddHolidayPreviewColumns";

type AddHolidayPreviewListProps = Readonly<{
  excelRowsData: ExcelRowsData;
  masterCode: ExcelImportData["master_code"];
  excelTemplateId: ExcelImportData["excel_template_id"];
  excelMappedOptions: ExcelMappedOptions;
}>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
  ) => void;
  setError: UseFormSetError<HolidayFormFieldValues>;
};

export const AddHolidayPreviewList = forwardRef(
  (
    {
      masterCode,
      excelRowsData,
      excelTemplateId,
      excelMappedOptions,
    }: AddHolidayPreviewListProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const gridRef = useRef<AgGridReact<ExcelRowsData[number]>>(null);

    const { column, form, setError } = useAddHolidayPreviewColumns({
      excelRowsData,
      excelMappedOptions,
    });

    const processHolidayData = (
      values: HolidayFormFieldValues,
      onSubmit: (formValues: AddBulkDataUploadApiPayload) => void
    ) => {
      if (values[HOLIDAY]) {
        const payload = values[HOLIDAY].map((holiday) =>
          removeNegationValues({
            ...holiday,
            holiday_date:
              holiday.holiday_date &&
              DateTime.fromISO(holiday.holiday_date).toISODate(),
          })
        );

        onSubmit({ bulk_data: payload });
      } else {
        toasts.error({
          title: "Holiday data is missing.",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      async submitForm(onSubmit) {
        const handleFormSubmit: SubmitHandler<HolidayFormFieldValues> = (
          values
        ) => {
          if (hasFormErrors({ form })) {
            return;
          }

          if (!excelTemplateId && !masterCode) {
            return;
          }

          processHolidayData(values, onSubmit);
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

AddHolidayPreviewList.displayName = "AddHolidayPreviewList";
