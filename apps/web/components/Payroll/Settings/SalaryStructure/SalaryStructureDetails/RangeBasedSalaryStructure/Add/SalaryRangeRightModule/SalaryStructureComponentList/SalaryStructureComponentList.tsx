import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  CellKeyDownEvent,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useFormContext } from "react-hook-form";
import { type AgDataWithActions } from "../../../../../../../../../types/agGrid";
import { type SalaryComponentAllocationsType } from "../SalaryStructureRightModule";
import {
  useSalaryStructureComponentListQueryFn,
  type SalaryComponentListType,
} from "./Hooks/useGetSalaryComponentList";
import { useGetSalaryComponentsColumns } from "./Hooks/useGetSalaryComponentsColumns";

export type SalaryStructureComponentListProps = {
  savedSalaryComponent: string[];
};

export const SalaryStructureComponentList = ({
  savedSalaryComponent,
}: SalaryStructureComponentListProps) => {
  const gridRef = useRef<AgGridReact<SalaryComponentListType>>(null);

  const [loading, setLoading] = useState(false);

  const { getSalaryComponentsList } = useSalaryStructureComponentListQueryFn();

  const { setValue, watch } = useFormContext<SalaryComponentAllocationsType>();

  const { columns } = useGetSalaryComponentsColumns({
    loading,
    savedSalaryComponent,
  });

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { data } = await getSalaryComponentsList();

    const totalCount = data.length;

    let lastRow = -1;

    if (data?.length <= defaultPageSize) {
      lastRow = totalCount;
    }

    if (data.length === 0) {
      gridRef.current?.api.showNoRowsOverlay();
    } else {
      gridRef.current?.api.hideOverlay();
    }

    params.successCallback(data, lastRow);

    setLoading(false);
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

  const handleKeyDown = (
    keyBoardEvent: CellKeyDownEvent<SalaryComponentListType>
  ) => {
    const selectedRecordItems = watch("selectedRows");

    const { data } = keyBoardEvent;

    if (
      data?.earning_component_code &&
      savedSalaryComponent.includes(data?.earning_component_code)
    ) {
      return;
    }

    const event = keyBoardEvent.event as KeyboardEvent;

    if (event && data) {
      if (event.code === "Space") {
        const updatedSelectedRecords = {
          ...selectedRecordItems,
          [data.earning_component_code]: selectedRecordItems
            ? !selectedRecordItems[data.earning_component_code]
            : false,
        };

        setValue("selectedRows", updatedSelectedRecords);
      }
    }
  };

  return (
    <AgGrid<AgDataWithActions<SalaryComponentListType>>
      ref={gridRef}
      columnDefs={columns}
      onGridReady={onGridReady}
      rowSelection="multiple"
      height="calc(94vh - 210px)"
      pagination={false}
      onCellKeyDown={handleKeyDown}
      suppressRowClickSelection={true}
    />
  );
};
