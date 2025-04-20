import type {
  CellKeyDownEvent,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import type { ForwardedRef, MouseEvent } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormContext, type FieldValues } from "react-hook-form";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { ApproveLeaveRequestDialog } from "../../../Leave/LeaveOverview/LeaveDetails/PendingLeaveRequests/Dialogs/ActionDialogs/ApproveLeaveRequestDialog";
import { RejectLeaveRequestDialog } from "../../../Leave/LeaveOverview/LeaveDetails/PendingLeaveRequests/Dialogs/ActionDialogs/RejectLeaveRequestDialog";
import {
  useGetLeaveQueryFn,
  type LeaveType,
} from "../../Leave/LeaveList/hooks/useGetLeaveList";
import { useGetLeaveListColumns } from "../../Leave/LeaveList/hooks/useGetLeaveListColumns";
import type { LeaveFormValues, LeaveListRef } from "../Leave";

export type LeaveListProps = {
  leaveRequestIds: string[];
  search?: string | null;
  checkAll: boolean;
  externalFilter?: FieldValues;
  combinedData: LeaveType[];
  setCombinedData: (
    data: LeaveType[] | ((prev: LeaveType[]) => LeaveType[])
  ) => void;
  clearSelection: () => void;
};

export const LeaveList = forwardRef(
  (
    {
      leaveRequestIds,
      search = null,
      checkAll,
      externalFilter,
      combinedData,
      setCombinedData,
      clearSelection,
    }: LeaveListProps,
    ref: ForwardedRef<LeaveListRef>
  ) => {
    const gridRef = useRef<AgGridReact<LeaveType>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentLeaveRequest, setCurrentLeaveRequest] = useState<LeaveType>(
      {} as LeaveType
    );

    const [loading, setLoading] = useState(false);

    const { setValue, watch } = useFormContext<LeaveFormValues>();

    const handleSelect = (event: MouseEvent<HTMLButtonElement>) => {
      if ((event.target as HTMLInputElement).checked) {
        let selectedRecordItems = {};

        combinedData.forEach((row) => {
          selectedRecordItems = { ...selectedRecordItems, [row.id]: true };
        });

        if (Object.keys(selectedRecordItems)?.length > 0) {
          setValue("selectedRecords", selectedRecordItems);
        }
      } else {
        setValue("selectedRecords", null);
      }
    };

    const handleSingleChecked = (
      event: MouseEvent<HTMLButtonElement>,
      id: string
    ) => {
      if (
        (event.target as HTMLInputElement).checked &&
        [...leaveRequestIds, id].length === combinedData.length
      ) {
        setValue("checkAll", true);
      } else {
        setValue("checkAll", false);
      }
    };

    const handleKeyDown = (keyBoardEvent: CellKeyDownEvent<LeaveType>) => {
      const selectedRecordItems = watch("selectedRecords");

      const { data } = keyBoardEvent;

      const event = keyBoardEvent.event as KeyboardEvent;

      if (event && data) {
        if (event.code === "Space") {
          const updatedSelectedRecords = {
            ...selectedRecordItems,
            [data.id]: selectedRecordItems
              ? !selectedRecordItems[data.id]
              : true,
          };

          setValue("selectedRecords", updatedSelectedRecords);

          if (leaveRequestIds.length === combinedData.length - 1) {
            setValue("checkAll", true);
          } else {
            setValue("checkAll", false);
          }
        }
      }
    };

    const { columns } = useGetLeaveListColumns({
      loading,
      handleSelect,
      handleSingleChecked,
      leaveRequestIds,
      combinedData,
      onAction: (actionType, leave) => {
        onDialogOpen(actionType);
        setCurrentLeaveRequest(leave);
      },
    });

    const { getLeaveDetails } = useGetLeaveQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { leaveRequestApprovals, totalCount } = await getLeaveDetails({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
      });

      setCombinedData((prev: LeaveType[]) => [
        ...prev,
        ...leaveRequestApprovals,
      ]);

      let lastRow = -1;

      if (leaveRequestApprovals?.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      if (leaveRequestApprovals.length === 0) {
        setCombinedData([]);
      }

      setLoading(false);

      if (leaveRequestApprovals.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(leaveRequestApprovals, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useImperativeHandle(ref, () => ({
      refreshLeaveList: () => {
        refreshCache();
      },
      getSelectedLeaveRequestIds: () => {
        return (
          gridRef.current?.api.getSelectedRows().map((row) => row.id) || []
        );
      },
      clearSelection: () => {
        gridRef.current?.api.deselectAll();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
      setValue("selectedRecords", null);
      setValue("checkAll", false);
      setCombinedData([]);
    }, [search, externalFilter]);

    useMemo(() => {
      if (checkAll) {
        let selectedRecords = {};

        combinedData.forEach((row) => {
          selectedRecords = { ...selectedRecords, [row.id]: true };
        });

        if (Object.keys(selectedRecords)?.length > 0) {
          setValue("selectedRecords", selectedRecords);
        }
      }
    }, [combinedData]);

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    const dialogRenderer: DialogRenderer = {
      approve: currentLeaveRequest?.id && (
        <ApproveLeaveRequestDialog
          open
          employeeId={currentLeaveRequest.employee_id}
          leaveRequestId={currentLeaveRequest.id}
          onClose={onDialogClose}
          onEditSuccess={() => {
            refreshCache();
            gridRef.current?.api.deselectAll();
            clearSelection();
          }}
        />
      ),

      reject: currentLeaveRequest?.id && (
        <RejectLeaveRequestDialog
          open
          employeeId={currentLeaveRequest.employee_id}
          leaveRequestId={currentLeaveRequest.id}
          onClose={onDialogClose}
          onEditSuccess={() => {
            refreshCache();
            gridRef.current?.api.deselectAll();
            clearSelection();
          }}
        />
      ),
    };

    return (
      <>
        <AgGrid<AgDataWithActions<LeaveType>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          rowSelection="multiple"
          height="calc(89vh - 210px)"
          onCellKeyDown={handleKeyDown}
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

LeaveList.displayName = "LeaveList";
