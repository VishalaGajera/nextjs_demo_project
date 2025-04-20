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
import { EditLeaveRequestDialog } from "../../Dialogs/EditLeaveRequestDialog";
import type { LeaveEmployeeDetails } from "../../hooks/useGetLeaveEmployeeDetails";
import { ApproveLeaveRequestDialog } from "../Dialogs/ActionDialogs/ApproveLeaveRequestDialog";
import { CancelLeaveRequestDialog } from "../Dialogs/ActionDialogs/CancelLeaveRequestDialog";
import { RejectLeaveRequestDialog } from "../Dialogs/ActionDialogs/RejectLeaveRequestDialog";
import { ViewPendingLeaveRequestDialog } from "../Dialogs/ViewLeaveRequestDetailsDialog";
import {
  useGetPendingLeaveRequests,
  type LeaveRequestData,
} from "./hooks/useGetPendingLeaveRequests";
import { usePendingLeaveRequestsColumns } from "./hooks/usePendingLeaveRequestsColumns";

type PendingLeaveRequestsListProps = {
  employeeId: string;
  fromDate: string;
  toDate: string;
  leaveDetailsData?: LeaveEmployeeDetails;
  onEditSuccess: () => void;
};

export const PendingLeaveRequestsList = ({
  employeeId,
  fromDate,
  toDate,
  leaveDetailsData,
  onEditSuccess,
}: PendingLeaveRequestsListProps) => {
  const gridRef = useRef<AgGridReact<LeaveRequestData>>(null);

  const { data, isFetching } = useGetPendingLeaveRequests({
    employeeId,
    fromDate,
  });

  const [currentPendingLeaveRequest, setCurrentPendingLeaveRequest] =
    useState<LeaveRequestData>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { columns } = usePendingLeaveRequestsColumns({
    onAction: (actionType, pendingLeaveRequest) => {
      onDialogOpen(actionType);
      setCurrentPendingLeaveRequest(pendingLeaveRequest);
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
      if (!isFetching) {
        params.api.setGridOption("datasource", dataSource);
      }
    },
    [dataSource, isFetching]
  );

  const dialogRenderer: DialogRenderer = {
    edit: currentPendingLeaveRequest?.id && (
      <EditLeaveRequestDialog
        open
        employeeId={employeeId}
        fromDate={fromDate}
        toDate={toDate}
        leaveDetailsData={leaveDetailsData}
        leaveRequestId={currentPendingLeaveRequest.id}
        onClose={onDialogClose}
        onEditSuccess={() => {
          onEditSuccess();
        }}
      />
    ),
    view: currentPendingLeaveRequest?.id && (
      <ViewPendingLeaveRequestDialog
        open
        employeeId={employeeId}
        leaveRequestId={currentPendingLeaveRequest.id}
        onClose={onDialogClose}
      />
    ),
    approve: currentPendingLeaveRequest?.id && (
      <ApproveLeaveRequestDialog
        open
        employeeId={employeeId}
        leaveRequestId={currentPendingLeaveRequest.id}
        onClose={onDialogClose}
        onEditSuccess={() => {
          onEditSuccess();
        }}
      />
    ),
    reject: currentPendingLeaveRequest?.id && (
      <RejectLeaveRequestDialog
        open
        employeeId={employeeId}
        leaveRequestId={currentPendingLeaveRequest.id}
        onClose={onDialogClose}
        onEditSuccess={() => {
          onEditSuccess();
        }}
      />
    ),
    cancel: currentPendingLeaveRequest?.id && (
      <CancelLeaveRequestDialog
        open
        employeeId={employeeId}
        leaveRequestId={currentPendingLeaveRequest.id}
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
        height="30vh"
      />
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

PendingLeaveRequestsList.displayName = "PendingLeaveRequestsList";
