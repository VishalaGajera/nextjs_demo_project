"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
} from "react";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../utils/helper";
import { DeleteEarningDialog } from "../Dialogs/DeleteEarningDialog";
import { EditEarningDialog } from "../Dialogs/EditEarningDialog";
import { ViewEarningDialog } from "../Dialogs/ViewEarningDialog";
import type { EarningListRef } from "../Earning";
import { useEarningColumns } from "./hooks/useEarningColumns";
import { useGetEarningsQueryFn, type Earning } from "./hooks/useGetEarnings";

export type EarningListProps = { search?: string | null };

export const EarningList = forwardRef(
  ({ search = null }: EarningListProps, ref: ForwardedRef<EarningListRef>) => {
    const gridRef = useRef<AgGridReact<Earning>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentEarning, setCurrentEarning] = useState<Earning>();

    const [loading, setLoading] = useState(false);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const { columns } = useEarningColumns({
      onAction: (actionType, overtimeRateType) => {
        onDialogOpen(actionType);
        setCurrentEarning(overtimeRateType);
      },
      loading,
    });

    const { getEarnings } = useGetEarningsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { earningComponents, totalCount } = await getEarnings({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (earningComponents.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (earningComponents.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(earningComponents, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    useImperativeHandle(ref, () => ({
      refreshEarningList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentEarning && (
        <EditEarningDialog
          open
          onClose={onDialogClose}
          earningId={currentEarning.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentEarning && (
        <DeleteEarningDialog
          open
          onClose={onDialogClose}
          earningData={currentEarning}
          onDeleteSuccess={refreshCache}
        />
      ),
      view: currentEarning && (
        <ViewEarningDialog
          open
          onClose={onDialogClose}
          earningId={currentEarning.id}
        />
      ),
    };

    const onGridReady = useCallback((params: GridReadyEvent<Earning>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<Earning>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(89vh - 160px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

EarningList.displayName = "EarningList";
