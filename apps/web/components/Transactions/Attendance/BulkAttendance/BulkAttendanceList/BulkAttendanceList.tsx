import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  CellKeyDownEvent,
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
  useMemo,
  useRef,
  useState,
} from "react";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import { filterSearchParams } from "../../../../../utils/helper";

import { useFormContext, type FieldValues } from "react-hook-form";
import type {
  BulkAttendanceFormValues,
  bulkAttendanceListRef,
} from "../../../../../app/transactions/attendance/bulk-attendance/page";
import { useGetBulkAttendanceColumns } from "./hooks/useGetBulkAttendanceColumns";
import {
  useGetBulkAttendanceQueryFn,
  type BulkAttendanceType,
} from "./hooks/useGetBulkAttendances";

export type BulkAttendanceListProps = {
  checkAll: boolean;
  search?: string | null;
  employeeIds: string[];
  externalFilter?: FieldValues;
  allBulkAttendanceData: BulkAttendanceType[];
  setAllBulkAttendanceData: (
    value:
      | BulkAttendanceType[]
      | ((prev: BulkAttendanceType[]) => BulkAttendanceType[])
  ) => void;
};

export const BulkAttendanceList = forwardRef(
  (
    {
      search = null,
      employeeIds,
      checkAll,
      externalFilter,
      allBulkAttendanceData,
      setAllBulkAttendanceData,
    }: BulkAttendanceListProps,
    ref: ForwardedRef<bulkAttendanceListRef>
  ) => {
    const gridRef = useRef<AgGridReact<BulkAttendanceType>>(null);

    const [loading, setLoading] = useState(false);

    const { setValue, watch } = useFormContext<BulkAttendanceFormValues>();

    const handleSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
      if ((event.target as HTMLInputElement).checked) {
        let selectedRecordItems = {};

        allBulkAttendanceData.forEach((row) => {
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
      event: React.MouseEvent<HTMLButtonElement>,
      id: string
    ) => {
      if (
        (event.target as HTMLInputElement).checked &&
        [...employeeIds, id].length === allBulkAttendanceData.length
      ) {
        setValue("checkAll", true);
      } else {
        setValue("checkAll", false);
      }
    };

    const { columns } = useGetBulkAttendanceColumns({
      loading,
      handleSelect,
      handleSingleChecked,
      employeeIds,
      allBulkAttendanceData,
    });

    const handleKeyDown = (
      keyBoardEvent: CellKeyDownEvent<BulkAttendanceType>
    ) => {
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

          if (employeeIds.length === allBulkAttendanceData.length - 1) {
            setValue("checkAll", true);
          } else {
            setValue("checkAll", false);
          }
        }
      }
    };

    const { getBulkAttendance } = useGetBulkAttendanceQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { list, totalCount } = await getBulkAttendance({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
        companyId: externalFilter?.company_id,
      });

      let lastRow = -1;

      setAllBulkAttendanceData((prev: BulkAttendanceType[]) => [
        ...prev,
        ...list,
      ]);

      if (list?.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      if (list.length === 0) {
        setAllBulkAttendanceData([]);
      }

      setLoading(false);

      if (list.length === 0) {
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

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useImperativeHandle(ref, () => ({
      refreshBulkAttendanceList: () => {
        gridRef.current?.api.refreshInfiniteCache();
      },
      getSelectedEmployeeIds: () => {
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
      setAllBulkAttendanceData([]);
    }, [search, externalFilter]);

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    useMemo(() => {
      if (checkAll) {
        let selectedRecords = {};

        allBulkAttendanceData.forEach((row) => {
          selectedRecords = { ...selectedRecords, [row.id]: true };
        });

        if (Object.keys(selectedRecords)?.length > 0) {
          setValue("selectedRecords", selectedRecords);
        }
      }
    }, [allBulkAttendanceData]);

    return (
      <AgGrid<AgDataWithActions<BulkAttendanceType>>
        ref={gridRef}
        columnDefs={columns}
        onGridReady={onGridReady}
        rowSelection="multiple"
        height="calc(94vh - 210px)"
        onCellKeyDown={handleKeyDown}
        suppressRowClickSelection={true}
        pagination
      />
    );
  }
);

BulkAttendanceList.displayName = "BulkAttendanceList";
