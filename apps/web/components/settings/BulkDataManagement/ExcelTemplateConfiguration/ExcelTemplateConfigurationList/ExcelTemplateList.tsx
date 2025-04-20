"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeleteExcelTemplateConfigurationDialog } from "../Dialogs/DeleteExcelTemplateConfigurationDialog";
import { useGetExcelTemplateColumns } from "./hooks/useGetExcelTemplateColumns";
import {
  useGetExcelTemplatesQueryFn,
  type ExcelTemplate,
} from "./hooks/useGetExcelTemplates";

export type ExcelTemplateListProps = { search?: string | null };

export const ExcelTemplateList = ({
  search = null,
}: ExcelTemplateListProps) => {
  const gridRef = useRef<AgGridReact<ExcelTemplate>>(null);

  const router = useRouter();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [loading, setLoading] = useState(false);

  const [currentExcelTemplate, setCurrentExcelTemplate] =
    useState<ExcelTemplate>();

  const { columns } = useGetExcelTemplateColumns({
    onAction: (actionType, excelTemplate) => {
      if (actionType === "edit" && excelTemplate.id) {
        router.push(
          `excel-template-configuration/${excelTemplate.id}?page=edit-page`
        );
      } else if (actionType === "view" && excelTemplate.id) {
        router.push(
          `excel-template-configuration/${excelTemplate.id}?page=view-page`
        );
      } else if (actionType === "delete" && excelTemplate) {
        onDialogOpen(actionType);

        setCurrentExcelTemplate(excelTemplate);
      }
    },
    loading,
  });

  const { getExcelTemplates } = useGetExcelTemplatesQueryFn();

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { excelTemplates, totalCount } = await getExcelTemplates({
      body: {
        ...params,
        quickFilter: filterSearchParams(search),
      },
    });

    let lastRow = -1;

    if (excelTemplates.length <= defaultPageSize) {
      lastRow = totalCount;
    }

    setLoading(false);

    if (excelTemplates.length === 0) {
      gridRef.current?.api.showNoRowsOverlay();
    } else {
      gridRef.current?.api.hideOverlay();
    }

    return params.successCallback(excelTemplates, lastRow);
  };

  const dataSource: IDatasource = {
    getRows: (params) => {
      getRows(params);
    },
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption("datasource", dataSource);
  }, []);

  const refreshCache = () => {
    gridRef.current?.api.refreshInfiniteCache();
  };

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("datasource", dataSource);
    }
  }, [search]);

  if (loading) {
    gridRef.current?.api.hideOverlay();
  }

  const dialogRenderer: DialogRenderer = {
    delete: currentExcelTemplate && (
      <DeleteExcelTemplateConfigurationDialog
        open
        excelTemplate={currentExcelTemplate}
        onDeleteSuccess={refreshCache}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGrid<AgDataWithActions<ExcelTemplate>>
        ref={gridRef}
        columnDefs={columns}
        onGridReady={onGridReady}
        height="calc(95vh - 160px)"
        pagination
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

ExcelTemplateList.displayName = "ExcelTemplateList";
