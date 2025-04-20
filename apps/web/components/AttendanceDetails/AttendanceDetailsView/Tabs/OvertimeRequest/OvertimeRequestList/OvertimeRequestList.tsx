import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import { useQueryClient } from "@tanstack/react-query";
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
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import { attendanceDetailsKey } from "../../../../../../queryKeysFactories/attendanceView";
import type { AgDataWithActions } from "../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import type { AttendanceDetailsMeta } from "../../../../../Transactions/Attendance/AttendanceOverview/Dialogs/hooks/type";
import type { AttendanceDetails } from "../../../../AttendanceSummary/hooks/type";
import { ApproveOvertimeDialog } from "../Edit/Dialogs/ApproveOvertimeDialog";
import { CancelOvertimeDialog } from "../Edit/Dialogs/CancelOvertimeDialog";
import { EditOvertimeRequestDialog } from "../Edit/Dialogs/EditOvertimeRequestDialog";
import { RejectOvertimeDialog } from "../Edit/Dialogs/RejectOvertimeDialog";
import { ViewOvertimeRequestDialog } from "../Edit/Dialogs/ViewOvertimeRequestDialog";
import type { OvertimeRequestListRef } from "../OvertimeRequest";
import {
  useGetOvertimeRequestListQueryFn,
  type OvertimeRequest,
} from "./hooks/useGetOvertimeRequest";
import { useGetOvertimeRequestListColumns } from "./hooks/useGetOvertimeRequestColumns";

export type OvertimeRequestListProps = {
  attendanceDetails: AttendanceDetails;
  employeeId: string;
  date: string;
  metaData: AttendanceDetailsMeta;
};

export const OvertimeRequestList = forwardRef(
  (
    { attendanceDetails, employeeId, date, metaData }: OvertimeRequestListProps,

    ref: ForwardedRef<OvertimeRequestListRef>
  ) => {
    const gridRef = useRef<AgGridReact<OvertimeRequest>>(null);

    const queryClient = useQueryClient();

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentOvertimeRequest, setCurrentOvertimeRequest] =
      useState<OvertimeRequest>();

    const [loading, setLoading] = useState(false);

    const { column } = useGetOvertimeRequestListColumns({
      onAction: (actionType, overTimeRules) => {
        onDialogOpen(actionType);
        setCurrentOvertimeRequest(overTimeRules);
      },
      loading,
    });

    const { OvertimeRequestListBody } = useGetOvertimeRequestListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { overtimeRequests, totalCount } = await OvertimeRequestListBody({
        body: params,
        employeeId,
      });

      let lastRow = -1;

      if (overtimeRequests.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (overtimeRequests.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(overtimeRequests, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => ({
      refreshOvertimeRulesList() {
        refreshCache();
      },
    }));

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    const dialogRenderer: DialogRenderer = {
      edit: currentOvertimeRequest && (
        <EditOvertimeRequestDialog
          open
          onClose={onDialogClose}
          onEditSuccess={refreshCache}
          otRequestId={currentOvertimeRequest.id}
          employeeId={employeeId}
          attendanceDetails={attendanceDetails}
          metaData={metaData}
        />
      ),

      approve: currentOvertimeRequest && (
        <ApproveOvertimeDialog
          open
          onClose={onDialogClose}
          onApproveSuccess={() => {
            refreshCache();
            queryClient.invalidateQueries({
              queryKey: attendanceDetailsKey.get(employeeId, date),
            });
          }}
          otRequestId={currentOvertimeRequest.id}
          employeeId={employeeId}
        />
      ),

      reject: currentOvertimeRequest && (
        <RejectOvertimeDialog
          open
          onClose={onDialogClose}
          onRejectSuccess={refreshCache}
          otRequestId={currentOvertimeRequest.id}
          employeeId={employeeId}
        />
      ),

      cancel: currentOvertimeRequest && (
        <CancelOvertimeDialog
          open
          onClose={onDialogClose}
          onCancelSuccess={refreshCache}
          otRequestId={currentOvertimeRequest.id}
          employeeId={employeeId}
        />
      ),

      view: currentOvertimeRequest && (
        <ViewOvertimeRequestDialog
          open
          onClose={onDialogClose}
          otRequestId={currentOvertimeRequest.id}
          employeeId={employeeId}
          attendanceDetails={attendanceDetails}
        />
      ),
    };

    return (
      <>
        <AgGrid<AgDataWithActions<OvertimeRequest>>
          ref={gridRef}
          columnDefs={column}
          onGridReady={onGridReady}
          height="calc(85vh - 160px)"
          pagination
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

OvertimeRequestList.displayName = "OvertimeRequestList";
