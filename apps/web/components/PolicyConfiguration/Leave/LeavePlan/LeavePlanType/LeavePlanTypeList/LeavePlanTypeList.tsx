import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { DeleteMapLeavePlanTypeDialog } from "../Dialog/DeleteMapLeavePlanTypeDialog";
import type { MapLeavePlanTypeListRef } from "../LeavePlanType";
import { useGetLeavePlanTypeQueryFn } from "./hooks/useGetLeavePlanTypeList";
import type { LeaveTypeList } from "./hooks/useGetLeavePlanTypeListColumns";
import { useGetLeavePlanTypeListColumns } from "./hooks/useGetLeavePlanTypeListColumns";

type LeavePlanTypeListProps = {
  leavePlanId: string;
};

export const LeavePlanTypeList = forwardRef(
  (
    { leavePlanId }: LeavePlanTypeListProps,
    ref: ForwardedRef<MapLeavePlanTypeListRef>
  ) => {
    const gridRef = useRef<AgGridReact<LeaveTypeList>>(null);

    const [loading, setLoading] = useState(false);

    const [currentLeaveType, setCurrentLeaveType] = useState<LeaveTypeList>();

    const router = useRouter();

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const { getLeavePlanType } = useGetLeavePlanTypeQueryFn();

    const { column } = useGetLeavePlanTypeListColumns({
      onAction: (actionType, leaveType) => {
        if (actionType === "configureLeave") {
          return router.push(
            `/policy-configuration/leave/leave-plan/${leavePlanId}/configure-leave/add/${leaveType.id}?step=accrual`
          );
        }

        if (actionType === "edit") {
          return router.push(
            `/policy-configuration/leave/leave-plan/${leavePlanId}/configure-leave/edit/${leaveType.id}?step=accrual`
          );
        }

        if (actionType === "view") {
          return router.push(
            `/policy-configuration/leave/leave-plan/${leavePlanId}/configure-leave/view/${leaveType.id}?step=accrual`
          );
        }

        onDialogOpen(actionType);
        setCurrentLeaveType(leaveType);
      },
      loading,
    });

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const leavePlanType = await getLeavePlanType({ leavePlanId });

      let lastRow = -1;

      if (leavePlanType) {
        if (leavePlanType.length <= defaultPageSize) {
          lastRow = leavePlanType.length;
        }

        setLoading(false);

        if (!leavePlanType.length) {
          gridRef.current?.api.showNoRowsOverlay();
        } else {
          gridRef.current?.api.hideOverlay();
        }

        params.successCallback(leavePlanType, lastRow);
      }
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

    useImperativeHandle(ref, () => ({
      refreshMapLeavePlanType() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [leavePlanId]);

    const dialogRenderer: DialogRenderer = {
      delete: currentLeaveType && (
        <DeleteMapLeavePlanTypeDialog
          open
          leavePlanId={leavePlanId}
          leaveTypeId={currentLeaveType.id}
          leaveTypeName={currentLeaveType.leave_type_name}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<LeaveTypeList>>
          ref={gridRef}
          columnDefs={column}
          onGridReady={onGridReady}
          height="calc(100vh - 218px)"
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

LeavePlanTypeList.displayName = "LeavePlanTypeList";
