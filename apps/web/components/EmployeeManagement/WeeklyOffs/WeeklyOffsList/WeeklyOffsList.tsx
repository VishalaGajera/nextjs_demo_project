"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
} from "react";
import type { WeeklyOffsListRef } from "../../../../app/employee-management/weekly-offs/page";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../types/agGrid";
import type { DialogRenderer } from "../../../../types/dialogs";
import { filterSearchParams } from "../../../../utils/helper";
import { DeleteWeeklyOffsDialog } from "../Dialogs/DeleteWeeklyOffsDialog";
import {
  useGetWeeklyOffsQueryFn,
  type WeeklyOffs,
} from "./hooks/useGetWeeklyOffs";
import { useWeeklyOffsColumns } from "./hooks/useWeeklyOffsColumns";

export type WeeklyOffsListProps = { search?: string | null };

export const WeeklyOffsList = forwardRef(
  (
    { search = null }: WeeklyOffsListProps,
    ref: ForwardedRef<WeeklyOffsListRef>
  ) => {
    const router = useRouter();

    const gridRef = useRef<AgGridReact<WeeklyOffs>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentWeeklyOffs, setCurrentWeeklyOffs] = useState<WeeklyOffs>();

    const [loading, setLoading] = useState(false);

    const { columns } = useWeeklyOffsColumns({
      onAction: (actionType, WeeklyOffs) => {
        if (actionType === "edit") {
          router.push(
            `/employee-management/weekly-offs/${WeeklyOffs.id}?type=edit`
          );
        } else if (actionType === "view") {
          router.push(
            `/employee-management/weekly-offs/${WeeklyOffs.id}?type=view`
          );
        } else {
          onDialogOpen(actionType);
        }
        setCurrentWeeklyOffs(WeeklyOffs);
      },
      loading,
    });

    const { getWeeklyOffs } = useGetWeeklyOffsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { weeklyOffTypes, totalCount } = await getWeeklyOffs({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (weeklyOffTypes.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (weeklyOffTypes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(weeklyOffTypes, lastRow);
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
      refreshWeeklyOffsList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      delete: currentWeeklyOffs && (
        <DeleteWeeklyOffsDialog
          open
          weeklyOffs={currentWeeklyOffs}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <Fragment>
        <AgGrid<AgDataWithActions<WeeklyOffs>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 160px)"
          pagination
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </Fragment>
    );
  }
);

WeeklyOffsList.displayName = "WeeklyOffsList";
