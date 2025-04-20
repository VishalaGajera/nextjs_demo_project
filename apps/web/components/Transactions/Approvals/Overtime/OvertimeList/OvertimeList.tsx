import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  CellKeyDownEvent,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type MouseEvent,
} from "react";
import { useFormContext, type FieldValues } from "react-hook-form";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { ApproveOvertimeDialog } from "../../../../AttendanceDetails/AttendanceDetailsView/Tabs/OvertimeRequest/Edit/Dialogs/ApproveOvertimeDialog";
import { RejectOvertimeDialog } from "../../../../AttendanceDetails/AttendanceDetailsView/Tabs/OvertimeRequest/Edit/Dialogs/RejectOvertimeDialog";
import type { OvertimeFormValues, OvertimeListRef } from "../Overtime";
import type { OvertimeType } from "./hooks/useGetOvertimeList";
import { useGetOvertimeQueryFn } from "./hooks/useGetOvertimeList";
import { useGetOvertimeListColumns } from "./hooks/useGetOvertimeListColumns";

export type OvertimeListProps = {
  overtimeRequestIds: string[];
  search?: string | null;
  checkAll: boolean;
  externalFilter?: FieldValues;
  combinedData: OvertimeType[];
  setCombinedData: (
    data: OvertimeType[] | ((prev: OvertimeType[]) => OvertimeType[])
  ) => void;
  clearSelection: () => void;
};

export const OvertimeList = forwardRef(
  (
    {
      overtimeRequestIds,
      search = null,
      checkAll,
      externalFilter,
      combinedData,
      setCombinedData,
      clearSelection,
    }: OvertimeListProps,
    ref: ForwardedRef<OvertimeListRef>
  ) => {
    const gridRef = useRef<AgGridReact<OvertimeType>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentOvertimeRequest, setCurrentOvertimeRequest] =
      useState<OvertimeType>({} as OvertimeType);

    const [loading, setLoading] = useState(false);

    const { setValue, watch } = useFormContext<OvertimeFormValues>();

    const handleSelect = (event: MouseEvent<HTMLButtonElement>) => {
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
      event: MouseEvent<HTMLButtonElement>,
      id: string
    ) => {
      if (
        (event.target as HTMLInputElement).checked &&
        [...overtimeRequestIds, id].length === combinedData.length
      ) {
        setValue("checkAll", true);
      } else {
        setValue("checkAll", false);
      }
    };

    const handleKeyDown = (keyBoardEvent: CellKeyDownEvent<OvertimeType>) => {
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

          if (overtimeRequestIds.length === combinedData.length - 1) {
            setValue("checkAll", true);
          } else {
            setValue("checkAll", false);
          }
        }
      }
    };

    const { columns } = useGetOvertimeListColumns({
      loading,
      handleSelect,
      handleSingleChecked,
      overtimeRequestIds,
      combinedData,
      onAction: (actionType, overtime) => {
        onDialogOpen(actionType);
        setCurrentOvertimeRequest(overtime);
      },
    });

    const { getOvertimeDetails } = useGetOvertimeQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { overtimeRequestApprovals, totalCount } = await getOvertimeDetails(
        {
          body: {
            ...params,
            externalFilter,
            quickFilter: filterSearchParams(search),
          },
        }
      );

      setCombinedData((prev: OvertimeType[]) => [
        ...prev,
        ...overtimeRequestApprovals,
      ]);

      let lastRow = -1;

      if (overtimeRequestApprovals?.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      if (overtimeRequestApprovals.length === 0) {
        setCombinedData([]);
      }

      setLoading(false);

      if (overtimeRequestApprovals.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(overtimeRequestApprovals, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useImperativeHandle(ref, () => ({
      refreshOvertimeList: () => {
        refreshCache();
      },
      getSelectedOvertimeRequestIds: () => {
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

    const dialogRenderer: DialogRenderer = {
      approve: currentOvertimeRequest && (
        <ApproveOvertimeDialog
          open
          onClose={onDialogClose}
          onApproveSuccess={() => {
            refreshCache();
            gridRef.current?.api.deselectAll();
            clearSelection();
          }}
          otRequestId={currentOvertimeRequest.id}
          employeeId={currentOvertimeRequest.employee_id}
        />
      ),
      reject: currentOvertimeRequest && (
        <RejectOvertimeDialog
          open
          onClose={onDialogClose}
          onRejectSuccess={() => {
            refreshCache();
            gridRef.current?.api.deselectAll();
            clearSelection();
          }}
          otRequestId={currentOvertimeRequest.id}
          employeeId={currentOvertimeRequest.employee_id}
        />
      ),
    };

    return (
      <>
        <AgGrid<AgDataWithActions<OvertimeType>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          rowSelection="multiple"
          height="calc(89vh - 210px)"
          onCellKeyDown={handleKeyDown}
          pagination
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

OvertimeList.displayName = "OvertimeList";
