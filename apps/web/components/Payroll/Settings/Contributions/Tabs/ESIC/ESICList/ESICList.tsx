"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../../utils/helper";
import { DeleteESICDialog } from "../Dialogs/DeleteESICDialog";
import { EditESICDialog } from "../Dialogs/EditESICDialog";
import { ViewESICDialog } from "../Dialogs/ViewESICDialog";
import type { ESICListRef } from "../ESICInfo";
import { useESICColumns } from "./hooks/useESICListColumns";
import { useGetESICListQueryFn, type ESICRecord } from "./hooks/useGetESICList";

export type ESICListProps = { search?: string | null };

export const ESICList = forwardRef(
  ({ search = null }: ESICListProps, ref: ForwardedRef<ESICListRef>) => {
    const gridRef = useRef<AgGridReact<ESICRecord>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentESIC, setCurrentESIC] = useState<ESICRecord>();

    const [loading, setLoading] = useState(false);

    const { columns } = useESICColumns({
      onAction: (actionType, esicGroup) => {
        onDialogOpen(actionType);
        setCurrentESIC(esicGroup);
      },
      loading,
    });

    const { getESICList } = useGetESICListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { esicGroups, totalCount } = await getESICList({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (esicGroups.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (esicGroups.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(esicGroups, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<ESICRecord>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const dialogRenderer: DialogRenderer = {
      edit: currentESIC && (
        <EditESICDialog
          open
          onClose={onDialogClose}
          esicId={currentESIC.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentESIC && (
        <DeleteESICDialog
          open
          onClose={onDialogClose}
          esicData={currentESIC}
          onDeleteSuccess={refreshCache}
        />
      ),
      view: currentESIC && (
        <ViewESICDialog open onClose={onDialogClose} esicId={currentESIC.id} />
      ),
    };

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshESICList() {
        refreshCache();
      },
    }));

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<ESICRecord>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 215px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

ESICList.displayName = "ESICList";
