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
import type { AgDataWithActions } from "../../../../../types/agGrid";
import { filterSearchParams } from "../../../../../utils/helper";
import type {
  BankShiftAllocationFormValues,
  bankShiftDayListRef,
} from "../BankShiftAllocationDetails";
import type { BankShiftAllocationType } from "./Hooks/useGetBankShiftAllocation";
import { useGetBankShiftAllocationQueryFn } from "./Hooks/useGetBankShiftAllocation";
import { useBankShiftAllocationColumns } from "./Hooks/useGetBankShiftAllocationColumns";

export type BankShiftAllocationListProps = {
  search?: string | null;
  employeeIds: string[];
  checkAll: boolean;
  externalFilter?: FieldValues;
  allBankShiftAllocationData: BankShiftAllocationType[];
  setAllBankShiftAllocationData: (
    value:
      | BankShiftAllocationType[]
      | ((prev: BankShiftAllocationType[]) => BankShiftAllocationType[])
  ) => void;
};

export const BankShiftAllocationList = forwardRef(
  (
    {
      search = null,
      employeeIds,
      checkAll,
      externalFilter,
      allBankShiftAllocationData,
      setAllBankShiftAllocationData,
    }: BankShiftAllocationListProps,
    ref: ForwardedRef<bankShiftDayListRef>
  ) => {
    const gridRef = useRef<AgGridReact<BankShiftAllocationType>>(null);

    const { setValue, watch } = useFormContext<BankShiftAllocationFormValues>();

    const [loading, setLoading] = useState(false);

    const handleSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
      if ((event.target as HTMLInputElement).checked) {
        let selectedRecordItems = {};

        allBankShiftAllocationData.forEach((row) => {
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
        [...employeeIds, id].length === allBankShiftAllocationData.length
      ) {
        setValue("checkAll", true);
      } else {
        setValue("checkAll", false);
      }
    };

    const handleKeyDown = (
      keyBoardEvent: CellKeyDownEvent<BankShiftAllocationType>
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

          if (employeeIds.length === allBankShiftAllocationData.length - 1) {
            setValue("checkAll", true);
          } else {
            setValue("checkAll", false);
          }
        }
      }
    };

    const { columns } = useBankShiftAllocationColumns({
      loading,
      handleSelect,
      handleSingleChecked,
      employeeIds,
      allBankShiftAllocationData,
    });

    const { getBankShiftAllocation } = useGetBankShiftAllocationQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { list, totalCount } = await getBankShiftAllocation({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
        companyId: externalFilter?.company_id,
      });

      let lastRow = -1;

      setAllBankShiftAllocationData((prev: BankShiftAllocationType[]) => [
        ...prev,
        ...list,
      ]);

      if (list?.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      if (list.length === 0) {
        setAllBankShiftAllocationData([]);
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
      refreshBankShiftDayList: () => {
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
      setAllBankShiftAllocationData([]);
    }, [search, externalFilter]);

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    useMemo(() => {
      if (checkAll) {
        let selectedRecords = {};

        allBankShiftAllocationData.forEach((row) => {
          selectedRecords = { ...selectedRecords, [row.id]: true };
        });

        if (Object.keys(selectedRecords)?.length > 0) {
          setValue("selectedRecords", selectedRecords);
        }
      }
    }, [allBankShiftAllocationData]);

    return (
      <AgGrid<AgDataWithActions<BankShiftAllocationType>>
        ref={gridRef}
        columnDefs={columns}
        onGridReady={onGridReady}
        rowSelection="multiple"
        height="calc(94vh - 211px)"
        onCellKeyDown={handleKeyDown}
        suppressRowClickSelection={true}
        pagination
      />
    );
  }
);

BankShiftAllocationList.displayName = "BankShiftAllocationList";
