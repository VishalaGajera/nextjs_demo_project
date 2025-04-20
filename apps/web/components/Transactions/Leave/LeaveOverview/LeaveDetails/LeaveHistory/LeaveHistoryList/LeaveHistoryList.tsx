"use client";

import { AgGrid } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { CancelLeaveRequestDialog } from "../../PendingLeaveRequests/Dialogs/ActionDialogs/CancelLeaveRequestDialog";
import type { LeaveRequestData } from "../../PendingLeaveRequests/PendingLeaveRequestsList/hooks/useGetPendingLeaveRequests";
import { ViewLeaveHistoryDetailsDialog } from "../Dialogs/ViewLeaveHistoryDetailsDialog";
import { useGetLeaveHistoryList } from "./hooks/useGetLeaveHistoryList";
import { useLeaveHistoryColumns } from "./hooks/useLeaveHistoryColumns";

type LeaveHistoryListProps = {
  employeeId: string;
  fromDate: string;
  onEditSuccess: () => void;
};

export const LeaveHistoryList = ({
  employeeId,
  fromDate,
  onEditSuccess,
}: LeaveHistoryListProps) => {
  const gridRef = useRef<AgGridReact<LeaveRequestData>>(null);

  const { data, isFetching } = useGetLeaveHistoryList({
    employeeId,
    fromDate,
  });

  const [currentLeaveHistoryRequest, setCurrentLeaveHistoryRequest] =
    useState<LeaveRequestData>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { columns } = useLeaveHistoryColumns({
    onAction: (actionType, leaveHistoryRequest) => {
      onDialogOpen(actionType);
      setCurrentLeaveHistoryRequest(leaveHistoryRequest);
    },
    loading: isFetching,
  });

  const getRows = async (params: IGetRowsParams) => {
    if (isFetching) {
      gridRef.current?.api.showLoadingOverlay();

      return;
    }

    if (!data?.length) {
      gridRef.current?.api.showNoRowsOverlay();
    } else {
      gridRef.current?.api.hideOverlay();
    }

    params.successCallback(data || [], data?.length ?? 0);
  };

  const dataSource: IDatasource = {
    getRows: (params) => {
      getRows(params);
    },
  };

  useEffect(() => {
    if (!isFetching && gridRef.current?.api) {
      gridRef.current.api.setGridOption("datasource", dataSource);
    }
  }, [fromDate, data, isFetching]);

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    },
    [dataSource]
  );

  const dialogRenderer: DialogRenderer = {
    view: currentLeaveHistoryRequest?.id && (
      <ViewLeaveHistoryDetailsDialog
        open
        selectedEmployeeId={employeeId}
        leaveRequestId={currentLeaveHistoryRequest.id}
        onClose={onDialogClose}
      />
    ),
    cancel: currentLeaveHistoryRequest?.id && (
      <CancelLeaveRequestDialog
        open
        employeeId={employeeId}
        leaveRequestId={currentLeaveHistoryRequest.id}
        onClose={onDialogClose}
        onEditSuccess={() => {
          onEditSuccess();
        }}
      />
    ),
  };

  if (isFetching) {
    gridRef.current?.api.hideOverlay();
  }

  return (
    <>
      <AgGrid<AgDataWithActions<LeaveRequestData>>
        ref={gridRef}
        columnDefs={columns}
        onGridReady={onGridReady}
        height="50vh"
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

LeaveHistoryList.displayName = "LeaveHistoryList";
