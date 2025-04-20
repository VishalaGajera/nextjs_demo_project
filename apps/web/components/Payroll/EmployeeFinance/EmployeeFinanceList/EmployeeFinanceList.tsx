import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { type FieldValues } from "react-hook-form";
import type { AgDataWithActions } from "../../../../types/agGrid";
import { filterSearchParams } from "../../../../utils/helper";
import {
  BANK_STATUTORY,
  SALARY_OVERVIEW,
} from "../EmployeeFinanceDetails/Tabs/constants";
import { useEmployeeFinanceColumns } from "./Hooks/useEmployeeFinanceColumns";
import type { EmployeeFinanceListType } from "./Hooks/useGetEmployeeFinanceList";
import { useGetEmployeeFinanceListQueryFn } from "./Hooks/useGetEmployeeFinanceList";

export type EmployeeFinanceListProps = {
  search: string | null;
  externalFilter?: FieldValues;
};

export const EmployeeFinanceList = ({
  search = null,
  externalFilter,
}: EmployeeFinanceListProps) => {
  const gridRef = useRef<AgGridReact<EmployeeFinanceListType>>(null);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { columns } = useEmployeeFinanceColumns({
    loading,
    handleClickOnEmployee: (employeeId) => {
      router.push(
        `/payroll/employee-finance/${employeeId}?tab=${BANK_STATUTORY}&detail=${SALARY_OVERVIEW}`
      );
    },
  });

  const { getEmployeeFinanceList } = useGetEmployeeFinanceListQueryFn();

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { employeeFinances, totalCount } = await getEmployeeFinanceList({
      body: {
        ...params,
        externalFilter,
        quickFilter: filterSearchParams(search),
      },
    });

    let lastRow = -1;

    if (employeeFinances?.length <= defaultPageSize) {
      lastRow = totalCount;
    }

    setLoading(false);

    if (employeeFinances.length === 0) {
      gridRef.current?.api.showNoRowsOverlay();
    } else {
      gridRef.current?.api.hideOverlay();
    }

    params.successCallback(employeeFinances, lastRow);
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
  }, [search, externalFilter]);

  if (loading) {
    gridRef.current?.api.hideOverlay();
  }

  return (
    <AgGrid<AgDataWithActions<EmployeeFinanceListType>>
      ref={gridRef}
      columnDefs={columns}
      onGridReady={onGridReady}
      rowSelection="multiple"
      height="calc(88vh - 150px)"
      suppressRowClickSelection={true}
      pagination
    />
  );
};
