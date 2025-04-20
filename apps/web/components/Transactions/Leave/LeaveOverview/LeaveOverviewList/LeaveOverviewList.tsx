"use client";

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
import { type FieldValues } from "react-hook-form";
import type { LeaveListRef } from "../../../../../app/transactions/leave/leave-overview/page";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import { filterSearchParams } from "../../../../../utils/helper";
import {
  useGetLeaveOverviewEmployeesQueryFn,
  type LeaveEmployeeData,
} from "./hooks/useGetLeaveOverviewEmployees";
import { useLeaveOverviewColumns } from "./hooks/useLeaveOverviewColumns";

type LeaveOverviewListProps = {
  search?: string | null;
  externalFilter?: FieldValues;
};

export const LeaveOverviewList = forwardRef(
  (
    { search = null, externalFilter }: LeaveOverviewListProps,
    ref: ForwardedRef<LeaveListRef>
  ) => {
    const gridRef = useRef<AgGridReact<LeaveEmployeeData>>(null);

    const [loading, setLoading] = useState(false);

    const { columns } = useLeaveOverviewColumns({
      loading,
    });

    const { getLeaveEmployee } = useGetLeaveOverviewEmployeesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { list, totalCount } = await getLeaveEmployee({
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
      refreshLeaveList() {
        refreshCache();
      },
    }));

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <AgGrid<AgDataWithActions<LeaveEmployeeData>>
        ref={gridRef}
        columnDefs={columns}
        onGridReady={onGridReady}
        height="calc(90vh - 165px)"
        pagination
      />
    );
  }
);

LeaveOverviewList.displayName = "LeaveOverviewList";
