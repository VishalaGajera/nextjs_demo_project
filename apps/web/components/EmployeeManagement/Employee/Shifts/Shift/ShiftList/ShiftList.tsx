"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../utils/helper";
import { DeleteShiftDialog } from "./Dialogs/DeleteShiftDialog";
import type { ShiftDetail } from "./hooks/useGetShiftList";
import { useGetShiftListQueryFn } from "./hooks/useGetShiftList";
import { useShiftListColumns } from "./hooks/useShiftListColumns";

export type ShiftListRef = {
  refreshShiftList: () => void;
};
export type ShiftListProps = { search?: string | null };

export const ShiftList = forwardRef(
  ({ search = null }: ShiftListProps, ref: ForwardedRef<ShiftListRef>) => {
    const gridRef = useRef<AgGridReact<ShiftDetail>>(null);

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [selectedShift, setSelectedShift] = useState<ShiftDetail>();

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const { columns } = useShiftListColumns({
      onAction: (actionType, data) => {
        if (actionType === "edit" && data.shift_type === "fixed") {
          router.push(
            `/employee-management/shifts/shift/fixed-shift/${data.id}?type=edit`
          );
        } else if (actionType === "view" && data.shift_type === "fixed") {
          router.push(
            `/employee-management/shifts/shift/fixed-shift/${data.id}?type=view`
          );
        } else if (actionType === "delete") {
          onDialogOpen("delete");
          setSelectedShift(data);
        } else if (actionType === "edit" && data.shift_type === "flexible") {
          router.push(
            `/employee-management/shifts/shift/flexi-shift/${data.id}?type=edit`
          );
        } else if (actionType === "view" && data.shift_type === "flexible") {
          router.push(
            `/employee-management/shifts/shift/flexi-shift/${data.id}?type=view`
          );
        } else if (actionType === "edit" && data.shift_type === "auto") {
          router.push(
            `/employee-management/shifts/shift/auto-shift/${data.id}?type=edit`
          );
        } else if (actionType === "view" && data.shift_type === "auto") {
          router.push(
            `/employee-management/shifts/shift/auto-shift/${data.id}?type=view`
          );
        } else {
          router.push(
            `/employee-management/shifts/shift/flexi-shift/${data.id}`
          );
        }
      },
      loading,
    });

    const { getShiftDetail } = useGetShiftListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { shiftTypes, totalCount } = await getShiftDetail({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (shiftTypes?.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (shiftTypes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(shiftTypes, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => ({
      refreshShiftList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      delete: selectedShift?.id && (
        <DeleteShiftDialog
          open
          onClose={onDialogClose}
          shiftId={selectedShift.id}
          shiftName={selectedShift.shift_type_name ?? null}
          onDeleteSuccess={refreshCache}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<ShiftDetail>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 160px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

ShiftList.displayName = "ShiftList";
