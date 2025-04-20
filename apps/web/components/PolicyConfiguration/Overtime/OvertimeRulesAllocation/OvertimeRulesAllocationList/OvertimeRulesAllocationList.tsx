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
  OvertimeRulesAllocationFormValues,
  overtimeRulesAllocationListRef,
} from "../../../../../app/policy-configuration/overtime/overtime-rule-allocation/page";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import { filterSearchParams } from "../../../../../utils/helper";
import { useGetOvertimeRulesAllocationColumns } from "./Hooks/useGetOvertimeRulesAllocationColumns";
import {
  useGetOvertimeRulesListQueryFn,
  type OvertimeRulesAllocationListType,
} from "./Hooks/useGetOvertimeRulesAllocationList";

export type OvertimeRulesAllocationListProps = {
  checkAll: boolean;
  search?: string | null;
  employeeIds: string[];
  externalFilter?: FieldValues;
  overtimeRulesList: OvertimeRulesAllocationListType[];
  setOvertimeRulesList: (
    value:
      | OvertimeRulesAllocationListType[]
      | ((
          prev: OvertimeRulesAllocationListType[]
        ) => OvertimeRulesAllocationListType[])
  ) => void;
};

export const OvertimeRulesAllocationList = forwardRef(
  (
    {
      search = null,
      employeeIds,
      checkAll,
      externalFilter,
      overtimeRulesList,
      setOvertimeRulesList,
    }: OvertimeRulesAllocationListProps,
    ref: ForwardedRef<overtimeRulesAllocationListRef>
  ) => {
    const { setValue, watch } =
      useFormContext<OvertimeRulesAllocationFormValues>();

    const gridRef = useRef<AgGridReact<OvertimeRulesAllocationListType>>(null);

    const [loading, setLoading] = useState(false);

    const handleSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
      if ((event.target as HTMLInputElement).checked) {
        let selectedRecordItems = {};

        overtimeRulesList.forEach((row) => {
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
        [...employeeIds, id].length === overtimeRulesList.length
      ) {
        setValue("checkAll", true);
      } else {
        setValue("checkAll", false);
      }
    };

    const handleKeyDown = (
      keyBoardEvent: CellKeyDownEvent<OvertimeRulesAllocationListType>
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

          if (employeeIds.length === overtimeRulesList.length - 1) {
            setValue("checkAll", true);
          } else {
            setValue("checkAll", false);
          }
        }
      }
    };

    const { columns } = useGetOvertimeRulesAllocationColumns({
      loading,
      handleSelect,
      handleSingleChecked,
      employeeIds,
      overtimeRulesList,
    });

    const { getOverTimeRulesList } = useGetOvertimeRulesListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { list, totalCount } = await getOverTimeRulesList({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
        companyId: externalFilter?.company_id,
      });

      let lastRow = -1;

      setOvertimeRulesList((prev: OvertimeRulesAllocationListType[]) => [
        ...prev,
        ...list,
      ]);

      if (list?.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      if (list.length === 0) {
        setOvertimeRulesList([]);
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
      refreshOvertimeRulesAllocationList: () => {
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
      setOvertimeRulesList([]);
    }, [search, externalFilter]);

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    useMemo(() => {
      if (checkAll) {
        let selectedRecords = {};

        overtimeRulesList.forEach((row) => {
          selectedRecords = { ...selectedRecords, [row.id]: true };
        });

        if (Object.keys(selectedRecords)?.length > 0) {
          setValue("selectedRecords", selectedRecords);
        }
      }
    }, [overtimeRulesList]);

    return (
      <AgGrid<AgDataWithActions<OvertimeRulesAllocationListType>>
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

OvertimeRulesAllocationList.displayName = "OvertimeRulesAllocationList";
