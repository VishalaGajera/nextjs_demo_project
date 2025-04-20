"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import {
  type ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { OvertimeRateTypeListRef } from "../../../../../app/policy-configuration/overtime/overtime-rate-type/page";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeleteOvertimeRateTypeDialog } from "../Dialogs/DeleteOvertimeRateTypeDialog";
import { EditOvertimeRateTypeDialog } from "../Dialogs/EditOvertimeRateTypeDialog";
import { ViewOvertimeRateTypeDialog } from "../Dialogs/ViewOvertimeRateTypeDialog";
import {
  type OvertimeRateType,
  useGetOvertimeRateTypesUnitsQueryFn,
} from "./hooks/useGetOvertimeRateTypes";
import { useOvertimeRateTypeColumns } from "./hooks/useOvertimeRateTypeColumns";

export type OvertimeRateTypeListProps = { search?: string | null };

export const OvertimeRateTypeList = forwardRef(
  (
    { search = null }: OvertimeRateTypeListProps,
    ref: ForwardedRef<OvertimeRateTypeListRef>
  ) => {
    const gridRef = useRef<AgGridReact<OvertimeRateType>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentOvertimeRateType, setCurrentOvertimeRateType] =
      useState<OvertimeRateType>();

    const [loading, setLoading] = useState(false);

    const { columns } = useOvertimeRateTypeColumns({
      onAction: (actionType, overtimeRateType) => {
        onDialogOpen(actionType);
        setCurrentOvertimeRateType(overtimeRateType);
      },
      loading,
    });

    const { getOvertimeRateType } = useGetOvertimeRateTypesUnitsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { overtimeRateType, totalCount } = await getOvertimeRateType({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (overtimeRateType.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (overtimeRateType.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(overtimeRateType, lastRow);
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
      refreshOvertimeRateTypeList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentOvertimeRateType && (
        <EditOvertimeRateTypeDialog
          open
          onClose={onDialogClose}
          overtimeRateTypeId={currentOvertimeRateType.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentOvertimeRateType && (
        <DeleteOvertimeRateTypeDialog
          open
          overtimeRateType={currentOvertimeRateType}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentOvertimeRateType && (
        <ViewOvertimeRateTypeDialog
          open
          onClose={onDialogClose}
          overtimeRateTypeId={currentOvertimeRateType.id}
        />
      ),
    };

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<OvertimeRateType>>
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

OvertimeRateTypeList.displayName = "OvertimeRateTypeList";
