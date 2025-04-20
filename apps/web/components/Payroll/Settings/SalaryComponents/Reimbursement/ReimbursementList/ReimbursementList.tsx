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
import type { SalaryComponent } from "../../SalaryComponentForm";
import { DeleteReimbursementDialog } from "../Dialogs/DeleteReimbursementDialog";
import { EditReimbursementDialog } from "../Dialogs/EditReimbursementDialog";
import { ViewReimbursementDialog } from "../Dialogs/ViewReimbursementDialog";
import type { ReimbursementListRef } from "../Reimbursement";
import { useGetReimbursementsQueryFn } from "./hooks/useGetReimbursements";
import { useReimbursementColumns } from "./hooks/useReimbursementColumns";

export type ReimbursementListProps = { search?: string | null };

export const ReimbursementList = forwardRef(
  (
    { search = null }: ReimbursementListProps,
    ref: ForwardedRef<ReimbursementListRef>
  ) => {
    const gridRef = useRef<AgGridReact<SalaryComponent>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentReimbursement, setCurrentReimbursement] =
      useState<SalaryComponent>();

    const [loading, setLoading] = useState(false);

    const { columns } = useReimbursementColumns({
      onAction: (actionType, reimbursement) => {
        onDialogOpen(actionType);
        setCurrentReimbursement(reimbursement);
      },
      loading,
    });

    const { getReimbursements } = useGetReimbursementsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { reimbursementComponents, totalCount } = await getReimbursements({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (reimbursementComponents.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (reimbursementComponents.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(reimbursementComponents, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback(
      (params: GridReadyEvent<SalaryComponent>) => {
        params.api.setGridOption("datasource", dataSource);
      },
      []
    );

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshReimbursementList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentReimbursement && (
        <EditReimbursementDialog
          open
          onClose={onDialogClose}
          reimbursementId={currentReimbursement.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentReimbursement && (
        <DeleteReimbursementDialog
          open
          reimbursement={currentReimbursement}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentReimbursement && (
        <ViewReimbursementDialog
          open
          onClose={onDialogClose}
          reimbursementId={currentReimbursement.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<SalaryComponent>>
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

ReimbursementList.displayName = "ReimbursementList";
