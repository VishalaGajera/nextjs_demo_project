import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AgDataWithActions } from "../../../../../../../../../../types/agGrid";
import { useGetPaymentHistoryQueryFn } from "./hooks/useGetPaymentHistory";
import {
  useGetPaymentHistoryColumns,
  type PaymentHistoryType,
} from "./hooks/useGetPaymentHistoryColumns";

type PaymentDetailsHistoryListProps = {
  employeeId: string;
};

export const PaymentDetailsHistoryList = ({
  employeeId,
}: PaymentDetailsHistoryListProps) => {
  const gridRef = useRef<AgGridReact<PaymentHistoryType>>(null);

  const [loading, setLoading] = useState(false);

  const { column } = useGetPaymentHistoryColumns({ loading });

  const { fetchPaymentHistory } = useGetPaymentHistoryQueryFn();

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { histories, totalCount } = await fetchPaymentHistory({
      employeeId,
      body: {
        ...params,
      },
    });

    let lastRow = -1;

    if (histories) {
      if (histories.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (histories.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(histories, lastRow);
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
    <AgGrid<AgDataWithActions<PaymentHistoryType>>
      ref={gridRef}
      columnDefs={column}
      onGridReady={onGridReady}
      height="calc(85vh - 201px)"
    />
  );
};
