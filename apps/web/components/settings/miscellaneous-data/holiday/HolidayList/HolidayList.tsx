"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
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
  useRef,
  useState,
} from "react";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeleteHolidayDialog } from "../Dialogs/DeleteHolidayDialog";
import { EditHolidayDialog } from "../Dialogs/EditHolidayDialog";
import { ViewHolidayDialog } from "../Dialogs/ViewHolidayDialog";
import type { HolidayListRef } from "../Holiday";
import type { Holiday } from "./hooks/useGetHolidays";
import { useGetHolidayQueryFn } from "./hooks/useGetHolidays";
import { useHolidaysColumns } from "./hooks/useHolidayColumns";
export type HolidayListProps = {
  search?: string | null;
  year: number | null;
};

export const HolidayList = forwardRef(
  (
    { search = null, year = null }: HolidayListProps,
    ref: ForwardedRef<HolidayListRef>
  ) => {
    const gridRef = useRef<AgGridReact<Holiday>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentHoliday, setCurrentHoliday] = useState<Holiday>();

    const [loading, setLoading] = useState(false);

    const { columns } = useHolidaysColumns({
      onAction: (actionType, holiday) => {
        onDialogOpen(actionType);
        setCurrentHoliday(holiday);
      },
      loading,
    });

    const { getHoliday } = useGetHolidayQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { startRow, endRow, sortModel, filterModel } = params;

      const { holidays, totalCount } = await getHoliday({
        body: {
          startRow,
          endRow,
          sortModel,
          filterModel: {
            ...filterModel,
            year: {
              filterType: "number",
              type: "equals",
              filter: year,
            },
          },
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (holidays.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (holidays.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(holidays, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<Holiday>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search, year]);

    useImperativeHandle(ref, () => ({
      refreshHolidayList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentHoliday && (
        <EditHolidayDialog
          open
          onClose={onDialogClose}
          holidayId={currentHoliday.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentHoliday && (
        <ViewHolidayDialog
          open
          onClose={onDialogClose}
          holidayId={currentHoliday.id}
        />
      ),
      delete: currentHoliday && (
        <DeleteHolidayDialog
          open
          holiday={currentHoliday}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<Holiday>>
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

HolidayList.displayName = "holidayList";
