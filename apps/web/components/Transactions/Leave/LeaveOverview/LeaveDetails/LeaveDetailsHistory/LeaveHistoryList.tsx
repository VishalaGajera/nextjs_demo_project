import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { DateTime } from "luxon";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { AgDataWithActions } from "../../../../../../types/agGrid";
import { useGetLeaveHistoryQueryFn } from "./hooks/useGetLeaveHistory";
import {
  type LeaveHistoryType,
  useGetLeaveHistoryColumns,
} from "./hooks/useGetLeaveHistoryColumns";

type LeaveHistoryListProps = {
  leaveTypeId: string;
  employeeId: string;
};

export const LeaveHistoryList = ({
  leaveTypeId,
  employeeId,
}: LeaveHistoryListProps) => {
  const gridRef = useRef<AgGridReact<LeaveHistoryType>>(null);

  const [loading, setLoading] = useState(false);

  const { column } = useGetLeaveHistoryColumns({ loading });

  const { fetchLeaveHistory } = useGetLeaveHistoryQueryFn();

  const formMethods = useForm({
    defaultValues: {
      from_date: DateTime.now().toISODate(),
      to_date: DateTime.now().endOf("year").toISODate(),
    },
  });

  const { watch } = formMethods;

  const fromDate = watch("from_date");

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { data, totalCount } = await fetchLeaveHistory({
      employeeId,
      leaveTypeId,
      from_date: fromDate,
      body: {
        ...params,
      },
    });

    let lastRow = -1;

    if (data) {
      if (data.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (data.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(data, lastRow);
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

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("datasource", dataSource);
    }
  }, []);

  if (loading) {
    gridRef.current?.api.hideOverlay();
  }

  return (
    <AgGrid<AgDataWithActions<LeaveHistoryType>>
      ref={gridRef}
      columnDefs={column}
      onGridReady={onGridReady}
      height="calc(85vh - 205px)"
    />
  );
};
