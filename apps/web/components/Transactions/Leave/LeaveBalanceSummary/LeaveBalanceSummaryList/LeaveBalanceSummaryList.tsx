"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import {
  type ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { FieldValues } from "react-hook-form";
import type { LeaveBalanceSummaryListRef } from "../../../../../app/transactions/leave/leave-balance-summary/page";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { useGetLeaveTypePerCompanyOptions } from "../../../../common/Autocomplete/hooks/useGetLeaveTypePerCompanyOptions";
import { EditLeaveBalanceDialog } from "../Dialogs/EditLeaveBalanceDialog";
import { useGetLeaveBalanceSummaryColumns } from "./hooks/useGetLeaveBalanceSummaryColumns";
import {
  type LeaveBalanceSummaryData,
  useGetLeaveBalanceSummaryListQueryFn,
} from "./hooks/useGetLeaveBalanceSummaryList";

type LeaveBalanceSummaryListProps = {
  search?: string | null;
  externalFilter?: FieldValues;
};

export const LeaveBalanceSummaryList = forwardRef(
  (
    { search = null, externalFilter }: LeaveBalanceSummaryListProps,
    ref: ForwardedRef<LeaveBalanceSummaryListRef>
  ) => {
    const gridRef = useRef<AgGridReact<LeaveBalanceSummaryData>>(null);

    const [loading, setLoading] = useState(false);

    const [currentLeaveBalanceSummary, setCurrentLeaveBalanceSummary] =
      useState<LeaveBalanceSummaryData>();

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const { data: leaveTypeOptions } = useGetLeaveTypePerCompanyOptions({
      companyId: externalFilter?.company_id,
    });

    const { columns } = useGetLeaveBalanceSummaryColumns({
      onAction: (actionType, leaveBalance) => {
        onDialogOpen(actionType);
        setCurrentLeaveBalanceSummary(leaveBalance);
      },
      loading,
      leaveTypes: leaveTypeOptions,
    });

    const { getLeaveBalanceSummaryList } =
      useGetLeaveBalanceSummaryListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { list, totalCount } = await getLeaveBalanceSummaryList({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (list?.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (list?.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(list, lastRow);
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
    }, [search, externalFilter]);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => ({
      refreshLeaveBalanceSummaryist() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentLeaveBalanceSummary && (
        <EditLeaveBalanceDialog
          open
          onClose={onDialogClose}
          employeeId={currentLeaveBalanceSummary.id}
          onEditSuccess={refreshCache}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<LeaveBalanceSummaryData>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(90vh - 165px)"
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

LeaveBalanceSummaryList.displayName = "LeaveBalanceSummaryList";
