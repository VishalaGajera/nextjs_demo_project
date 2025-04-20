"use client";

import { AgGrid } from "@codezee/sixtify-brahma";
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
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AttendanceListRef } from "../../../../../app/transactions/attendance/attendance-overview/page";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import { AgGridStickyHeaderProvider } from "../../../../../provider/AgGridStickyHeaderProvider";
import { attendanceDetailsKey } from "../../../../../queryKeysFactories/attendanceView";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { AddAttendanceDialog } from "../../../../Transactions/Attendance/AttendanceOverview/Dialogs/AddAttendanceDialog";
import type { AttendanceRecord } from "../../../AttendanceSummary/hooks/type";
import { useAttendanceListViewColumns } from "./hooks/useAttendanceListViewColumns";

type AttendanceListViewProps = {
  attendanceRecords: AttendanceRecord[];
  isLoading: boolean;
  employeeId: string;
  date: string;
  stickValue?: number;
  joiningData: string;
};

export const AttendanceListView = forwardRef(
  (
    {
      attendanceRecords = [],
      isLoading,
      employeeId,
      date,
      stickValue = 0,
      joiningData,
    }: AttendanceListViewProps,
    ref: ForwardedRef<AttendanceListRef>
  ) => {
    const gridRef = useRef<AgGridReact<AttendanceRecord>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [totalCount, setTotalCount] = useState(0);

    const queryClient = useQueryClient();

    const [currentAttendance, setCurrentAttendance] =
      useState<AttendanceRecord>();

    const { columns } = useAttendanceListViewColumns({
      loading: isLoading,
      onAction: (actionType, attendance) => {
        onDialogOpen(actionType);
        setCurrentAttendance(attendance);
      },
    });

    const getRows = async (params: IGetRowsParams) => {
      let lastRow = -1;

      if (attendanceRecords.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
        lastRow = attendanceRecords.length;
      }

      if (isLoading) {
        gridRef.current?.api.hideOverlay();
      }

      setTotalCount(lastRow);

      params.successCallback(attendanceRecords, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback(
      (params: GridReadyEvent) => {
        params.api.setGridOption("datasource", dataSource);
      },
      [dataSource]
    );

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [attendanceRecords]);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => ({
      refreshAttendanceList() {
        refreshCache();
      },
    }));

    const dynamicHeight = useMemo(() => {
      return totalCount ? "auto" : "calc(60vh - 100px)";
    }, [totalCount]);

    const dialogRenderer: DialogRenderer = {
      add: currentAttendance && (
        <AddAttendanceDialog
          open
          onClose={onDialogClose}
          onAddSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: attendanceDetailsKey.get(employeeId, date),
            });
          }}
          currentAttendance={currentAttendance}
          employeeId={employeeId}
          joiningData={joiningData}
        />
      ),
    };

    return (
      <>
        <AgGridStickyHeaderProvider stickValue={stickValue}>
          <AgGrid<AgDataWithActions<AttendanceRecord>>
            ref={gridRef}
            columnDefs={columns}
            onGridReady={onGridReady}
            height={dynamicHeight}
            rowHeight={60}
            cacheBlockSize={35}
          />
        </AgGridStickyHeaderProvider>

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

AttendanceListView.displayName = "AttendanceListView";
