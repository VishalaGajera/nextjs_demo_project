import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import { type AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { ViewImportLogDialog } from "./Dialogs/ViewImportLogDialog";
import { useBulkDataListColumns } from "./Hooks/useBulkDataListColumns";
import {
  useGetBulkDataListQueryFn,
  type DataImportType,
} from "./Hooks/useGetBulkDataList";

type BulkDataImportsListProps = {
  search: string | null;
};

export const BulkDataImportsList = ({
  search = null,
}: BulkDataImportsListProps) => {
  const gridRef = useRef<AgGridReact<DataImportType>>(null);

  const [loading, setLoading] = useState(false);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [rowData, setRowData] = useState<DataImportType>();

  const { columns } = useBulkDataListColumns({
    loading,
    onAction: (type, rowData) => {
      setRowData(rowData);

      onDialogOpen(type);
    },
  });

  const { getBulkDataList } = useGetBulkDataListQueryFn();

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { dataImports, totalCount } = await getBulkDataList({
      body: {
        quickFilter: filterSearchParams(search),
        ...params,
      },
    });

    let lastRow = -1;

    if (dataImports.length <= defaultPageSize) {
      lastRow = totalCount;
    }

    setLoading(false);

    if (dataImports.length === 0) {
      gridRef.current?.api.showNoRowsOverlay();
    } else {
      gridRef.current?.api.hideOverlay();
    }

    return params.successCallback(dataImports, lastRow);
  };

  const dataSource: IDatasource = {
    getRows: (params) => {
      getRows(params);
    },
  };

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("datasource", dataSource);
    }
  }, [search]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption("datasource", dataSource);
  }, []);

  if (loading) {
    gridRef.current?.api.hideOverlay();
  }

  const dialogRenderer: DialogRenderer = {
    view: rowData?.import_log && (
      <ViewImportLogDialog
        logStatus={rowData.import_log}
        onClose={onDialogClose}
        open
      />
    ),
  };

  return (
    <>
      <AgGrid<AgDataWithActions<DataImportType>>
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
