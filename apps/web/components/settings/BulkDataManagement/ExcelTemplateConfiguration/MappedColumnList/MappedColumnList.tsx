import { AgGrid } from "@codezee/sixtify-brahma";
import type { RowDoubleClickedEvent } from "ag-grid-community";
import { isEmpty } from "lodash";
import { useMemo, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import type {
  ExcelConfigurationFormFieldValues,
  ExcelTemplateFields,
} from "../ExcelTemplateConfigurationForm";
import { EditExcelTemplateFieldDialog } from "./Dialogs/EditExcelTemplateFieldDialog";
import { useExcelTemplateConfigurationColumns } from "./hooks/useExcelTemplateConfigurationColumns";

type MappedColumnListProps = Readonly<{
  setValue: UseFormSetValue<ExcelConfigurationFormFieldValues>;
  defaultFields: ExcelTemplateFields;
  disabled?: boolean;
}>;

export function MappedColumnList({
  setValue,
  defaultFields = [],
  disabled,
}: MappedColumnListProps) {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [currentField, setCurrentField] =
    useState<ExcelTemplateFields[number]>();

  const selectedFields = useMemo(() => {
    const selectedFieldsList = defaultFields.filter((field) => field.selected);

    return selectedFieldsList ?? [];
  }, [defaultFields.map((item) => item.required)]);

  const { column } = useExcelTemplateConfigurationColumns({
    onAction: (actionType, excelTemplateField) => {
      onDialogOpen(actionType);
      setCurrentField(excelTemplateField);
    },
    disabled,
    loading: false,
  });

  const onEditSuccess = (values: ExcelTemplateFields[number]) => {
    const updatedDefaultFields = defaultFields.map((field) => {
      if (field.id === values.id) {
        return { ...field, template_field_name: values.template_field_name };
      }

      return field;
    });

    setValue("excel_template_fields", updatedDefaultFields);

    onDialogClose();
  };

  const dialogRenderer: DialogRenderer = {
    edit: currentField && (
      <EditExcelTemplateFieldDialog
        open
        onClose={onDialogClose}
        currentField={currentField}
        onEditSuccess={onEditSuccess}
      />
    ),
  };

  const handleRowDoubleClick = (
    event: RowDoubleClickedEvent<AgDataWithActions<ExcelTemplateFields[number]>>
  ) => {
    if (disabled) {
      return;
    }

    const { data } = event;

    const clickedColumn = event.api.getFocusedCell()?.column;

    if (clickedColumn?.getColId() === "action") {
      return;
    }

    if (!isEmpty(data)) {
      setCurrentField(data);

      onDialogOpen("edit");
    }
  };

  return (
    <>
      <AgGrid<ExcelTemplateFields[number]>
        rowData={selectedFields}
        onCellDoubleClicked={handleRowDoubleClick}
        rowModelType="clientSide"
        columnDefs={column}
        height="550px"
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
