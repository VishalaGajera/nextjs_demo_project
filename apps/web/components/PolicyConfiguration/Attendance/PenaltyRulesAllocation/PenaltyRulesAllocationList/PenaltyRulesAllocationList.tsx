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
  PenaltyRulesAllocationFormValues,
  penaltyRulesAllocationListRef,
} from "../../../../../app/policy-configuration/attendance/penalty-rule-allocation/page";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import { filterSearchParams } from "../../../../../utils/helper";
import { useGetPenaltyRulesAllocationColumns } from "./hooks/useGetPenaltyRulesAllocationColumns";
import {
  useGetPenaltyRulesListQueryFn,
  type PenaltyRulesAllocationListType,
} from "./hooks/useGetPenaltyRulesAllocationList";

export type PenaltyRulesAllocationListProps = {
  checkAll: boolean;
  search?: string | null;
  employeeIds: string[];
  externalFilter?: FieldValues;
  penaltyRulesList: PenaltyRulesAllocationListType[];
  setPenaltyRulesList: (
    value:
      | PenaltyRulesAllocationListType[]
      | ((
          prev: PenaltyRulesAllocationListType[]
        ) => PenaltyRulesAllocationListType[])
  ) => void;
};

export const PenaltyRulesAllocationList = forwardRef(
  (
    {
      search = null,
      employeeIds,
      checkAll,
      externalFilter,
      penaltyRulesList,
      setPenaltyRulesList,
    }: PenaltyRulesAllocationListProps,
    ref: ForwardedRef<penaltyRulesAllocationListRef>
  ) => {
    const { setValue, watch } =
      useFormContext<PenaltyRulesAllocationFormValues>();

    const gridRef = useRef<AgGridReact<PenaltyRulesAllocationListType>>(null);

    const [loading, setLoading] = useState(false);

    const handleSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
      if ((event.target as HTMLInputElement).checked) {
        let selectedRecordItems = {};

        penaltyRulesList.forEach((row) => {
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
        [...employeeIds, id].length === penaltyRulesList.length
      ) {
        setValue("checkAll", true);
      } else {
        setValue("checkAll", false);
      }
    };

    const { columns } = useGetPenaltyRulesAllocationColumns({
      loading,
      handleSelect,
      handleSingleChecked,
      employeeIds,
      penaltyRulesList,
    });

    const handleKeyDown = (
      keyBoardEvent: CellKeyDownEvent<PenaltyRulesAllocationListType>
    ) => {
      const selectedRecordItems = watch("selectedRecords");

      const { data } = keyBoardEvent;

      const event = keyBoardEvent.event as KeyboardEvent;

      if (event && data) {
        if (event.key === " ") {
          const updatedSelectedRecords = {
            ...selectedRecordItems,
            [data.id]: selectedRecordItems
              ? !selectedRecordItems[data.id]
              : true,
          };

          setValue("selectedRecords", updatedSelectedRecords);
        }
      }
    };

    const { getPenaltyRulesList } = useGetPenaltyRulesListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { list, totalCount } = await getPenaltyRulesList({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
        companyId: externalFilter?.company_id,
      });

      let lastRow = -1;

      setPenaltyRulesList((prev: PenaltyRulesAllocationListType[]) => [
        ...prev,
        ...list,
      ]);

      if (list?.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      if (list.length === 0) {
        setPenaltyRulesList([]);
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
      refreshPenaltyRulesAllocationList: () => {
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
      setPenaltyRulesList([]);
    }, [search, externalFilter]);

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    useMemo(() => {
      if (checkAll) {
        let selectedRecords = {};

        penaltyRulesList.forEach((row) => {
          selectedRecords = { ...selectedRecords, [row.id]: true };
        });

        if (Object.keys(selectedRecords)?.length > 0) {
          setValue("selectedRecords", selectedRecords);
        }
      }
    }, [penaltyRulesList]);

    return (
      <AgGrid<AgDataWithActions<PenaltyRulesAllocationListType>>
        ref={gridRef}
        columnDefs={columns}
        onGridReady={onGridReady}
        onCellKeyDown={handleKeyDown}
        rowSelection="multiple"
        height="calc(94vh - 210px)"
        suppressRowClickSelection={true}
        pagination
      />
    );
  }
);

PenaltyRulesAllocationList.displayName = "PenaltyRulesAllocationList";
