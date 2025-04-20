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

import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeleteLeaveTypeDialog } from "../Dialogs/DeleteLeaveTypeDialog";
import { EditLeaveTypeDialog } from "../Dialogs/EditLeaveTypeDialog";
import { ViewLeaveTypeDialog } from "../Dialogs/ViewLeaveTypeDialog";
import { useLeaveTypeListColumns } from "./hooks/useGetLeaveTypeListColumns";
import type { LeaveType } from "./hooks/useGetLeaveTypesList";
import { useGetLeaveTypesQueryFn } from "./hooks/useGetLeaveTypesList";

export type LeaveTypeListRef = {
  refreshLeaveTypeList: () => void;
};
export type LeaveTypeListProps = { search?: string | null };

export const LeaveTypeList = forwardRef(
  (
    { search = null }: LeaveTypeListProps,
    ref: ForwardedRef<LeaveTypeListRef>
  ) => {
    const gridRef = useRef<AgGridReact<LeaveType>>(null);

    const [loading, setLoading] = useState(false);

    const [currentLeaveType, setCurrentLeaveType] = useState<LeaveType>();

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const { columns } = useLeaveTypeListColumns({
      onAction: (actionType, leavetype) => {
        onDialogOpen(actionType);
        setCurrentLeaveType(leavetype);
      },
      loading,
    });

    const { getLeaveTypesDetails } = useGetLeaveTypesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { leaveTypes, totalCount } = await getLeaveTypesDetails({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (leaveTypes?.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (leaveTypes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(leaveTypes, lastRow);
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
      refreshLeaveTypeList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      edit: currentLeaveType && (
        <EditLeaveTypeDialog
          open
          onClose={onDialogClose}
          leaveTypeId={currentLeaveType.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentLeaveType && (
        <DeleteLeaveTypeDialog
          open
          leaveType={currentLeaveType}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentLeaveType && (
        <ViewLeaveTypeDialog
          open
          leaveTypeId={currentLeaveType.id}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<LeaveType>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 160px)"
          pagination
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

LeaveTypeList.displayName = "LeaveTypeList";
