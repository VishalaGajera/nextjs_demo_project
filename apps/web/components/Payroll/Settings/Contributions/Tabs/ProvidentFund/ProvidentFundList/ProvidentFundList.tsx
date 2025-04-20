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
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../../utils/helper";
import { DeleteProvidentFundDialog } from "../Dialogs/DeleteProvidentFundDialog";
import { EditProvidentFundDialog } from "../Dialogs/EditProvidentFundDialog";
import { ViewProvidentFundDialog } from "../Dialogs/ViewProvidentFundDialog";
import type { ProvidentFundListRef } from "../ProvidentFund";
import {
  useGetProvidentFundQueryFn,
  type ProvidentFundRecord,
} from "./hooks/useGetProvidentFundList";
import { useProvidentFundColumns } from "./hooks/useProvidentFundListColumns";

export type ProvidentFundListProps = { search?: string | null };

export const ProvidentFundList = forwardRef(
  (
    { search = null }: ProvidentFundListProps,
    ref: ForwardedRef<ProvidentFundListRef>
  ) => {
    const gridRef = useRef<AgGridReact<ProvidentFundRecord>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentProvidentFund, setCurrentProvidentFund] =
      useState<ProvidentFundRecord>();

    const [loading, setLoading] = useState(false);

    const { columns } = useProvidentFundColumns({
      onAction: (actionType, providentFund) => {
        onDialogOpen(actionType);
        setCurrentProvidentFund(providentFund);
      },
      loading,
    });

    const { getProvidentFund } = useGetProvidentFundQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { epfGroups, totalCount } = await getProvidentFund({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (epfGroups.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (epfGroups.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(epfGroups, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const dialogRenderer: DialogRenderer = {
      edit: currentProvidentFund && (
        <EditProvidentFundDialog
          open
          onClose={onDialogClose}
          providentFundId={currentProvidentFund.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentProvidentFund && (
        <DeleteProvidentFundDialog
          open
          onClose={onDialogClose}
          providentFundData={currentProvidentFund}
          onDeleteSuccess={refreshCache}
        />
      ),
      view: currentProvidentFund && (
        <ViewProvidentFundDialog
          open
          onClose={onDialogClose}
          providentFundId={currentProvidentFund.id}
        />
      ),
    };

    const onGridReady = useCallback(
      (params: GridReadyEvent<ProvidentFundRecord>) => {
        params.api.setGridOption("datasource", dataSource);
      },
      []
    );

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshProvidentFundList() {
        refreshCache();
      },
    }));

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<ProvidentFundRecord>>
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

ProvidentFundList.displayName = "ProvidentFundList";
