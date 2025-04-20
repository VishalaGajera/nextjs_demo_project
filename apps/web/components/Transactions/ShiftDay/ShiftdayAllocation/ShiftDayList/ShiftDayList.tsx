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
import { useFormContext, type FieldValues } from "react-hook-form";
import type {
  ShiftDayFormValues,
  shiftDayListRef,
} from "../../../../../app/transactions/shift-day/shift-day-allocation/page";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import { filterSearchParams } from "../../../../../utils/helper";
import {
  useGetShiftDayQueryFn,
  type ShiftDayType,
} from "./hooks/useGetShiftDayList";
import { useShiftDayListColumns } from "./hooks/useGetShiftDayListColumns";

export type ShiftDayListProps = {
  employeeIds: string[];
  search?: string | null;
  checkAll: boolean;
  externalFilter?: FieldValues;
  combinedData: ShiftDayType[];
  setCombinedData: (
    data: ShiftDayType[] | ((prev: ShiftDayType[]) => ShiftDayType[])
  ) => void;
};

export const ShiftDayList = forwardRef(
  (
    {
      employeeIds,
      search = null,

      checkAll,
      externalFilter,
      combinedData,
      setCombinedData,
    }: ShiftDayListProps,
    ref: ForwardedRef<shiftDayListRef>
  ) => {
    const gridRef = useRef<AgGridReact<ShiftDayType>>(null);

    const [loading, setLoading] = useState(false);

    const { setValue, watch } = useFormContext<ShiftDayFormValues>();

    const handleSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
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
      event: React.MouseEvent<HTMLButtonElement>,
      id: string
    ) => {
      if (
        (event.target as HTMLInputElement).checked &&
        [...employeeIds, id].length === combinedData.length
      ) {
        setValue("checkAll", true);
      } else {
        setValue("checkAll", false);
      }
    };

    const handleKeyDown = (keyBoardEvent: CellKeyDownEvent<ShiftDayType>) => {
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

          if (employeeIds.length === combinedData.length - 1) {
            setValue("checkAll", true);
          } else {
            setValue("checkAll", false);
          }
        }
      }
    };

    const { columns } = useShiftDayListColumns({
      loading,
      handleSelect,
      handleSingleChecked,
      employeeIds,
      combinedData,
    });

    const { getShiftDayDetails } = useGetShiftDayQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { list, totalCount } = await getShiftDayDetails({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
        companyId: externalFilter?.company_id,
      });

      setCombinedData((prev: ShiftDayType[]) => [...prev, ...list]);

      let lastRow = -1;

      if (list?.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      if (list.length === 0) {
        setCombinedData([]);
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
      refreshShiftDayList: () => {
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

    return (
      <AgGrid<AgDataWithActions<ShiftDayType>>
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

ShiftDayList.displayName = "ShiftDayList";
