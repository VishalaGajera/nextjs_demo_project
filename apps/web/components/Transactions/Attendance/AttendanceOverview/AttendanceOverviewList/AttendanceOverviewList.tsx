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
import type { FieldValues } from "react-hook-form";
import type { AttendanceListRef } from "../../../../../app/transactions/attendance/attendance-overview/page";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import { filterSearchParams } from "../../../../../utils/helper";
import { useAttendanceOverviewColumns } from "./hooks/useAttendanceOverviewColumns";
import {
  useGetAttendanceOverViewEmployeesQueryFn,
  type AttendanceEmployeeData,
} from "./hooks/useGetAttendanceOverViewEmployees";

type AttendanceOverviewListProps = {
  search?: string | null;
  externalFilter?: FieldValues;
};

export const AttendanceOverviewList = forwardRef(
  (
    { search = null, externalFilter }: AttendanceOverviewListProps,
    ref: ForwardedRef<AttendanceListRef>
  ) => {
    const gridRef = useRef<AgGridReact<AttendanceEmployeeData>>(null);

    const [loading, setLoading] = useState(false);

    const { columns } = useAttendanceOverviewColumns({
      loading,
    });

    const { getAttendanceEmployee } =
      useGetAttendanceOverViewEmployeesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { employees, totalCount } = await getAttendanceEmployee({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (employees.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (employees.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(employees, lastRow);
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
      refreshAttendanceList() {
        refreshCache();
      },
    }));

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <AgGrid<AgDataWithActions<AttendanceEmployeeData>>
        ref={gridRef}
        columnDefs={columns}
        onGridReady={onGridReady}
        height="calc(90vh - 160px)"
        pagination
      />
    );
  }
);

AttendanceOverviewList.displayName = "AttendanceOverviewList";
