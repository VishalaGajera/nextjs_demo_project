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
import type { EmployeeCodeListRef } from "../../../../app/settings/employee-code/page";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../types/agGrid";
import type { DialogRenderer } from "../../../../types/dialogs";
import { filterSearchParams } from "../../../../utils/helper";
import { DeleteEmployeeCodeDialog } from "../Dialogs/DeleteEmployeeCodeDialog";
import { EditEmployeeCodeDialog } from "../Dialogs/EditEmployeeCodeDialog";
import { ViewEmployeeCodeDialog } from "../Dialogs/ViewEmployeeCodeDialog";
import { useEmployeeCodeColumns } from "./hooks/useEmployeeCodeColumns";
import {
  type EmployeeCode,
  useGetEmployeeCodesQueryFn,
} from "./hooks/useGetEmployeeCodes";

export type EmployeeCodeListProps = { search?: string | null };

export const EmployeeCodeList = forwardRef(
  (
    { search = null }: EmployeeCodeListProps,
    ref: ForwardedRef<EmployeeCodeListRef>
  ) => {
    const gridRef = useRef<AgGridReact<EmployeeCode>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentEmployeeCode, setCurrentEmployeeCode] =
      useState<EmployeeCode>();

    const [loading, setLoading] = useState(false);

    const { columns } = useEmployeeCodeColumns({
      onAction: (actionType, employeeCode) => {
        onDialogOpen(actionType);
        setCurrentEmployeeCode(employeeCode);
      },
      loading,
    });

    const { getEmployeeCodes } = useGetEmployeeCodesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { employeeCodes, totalCount } = await getEmployeeCodes({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (employeeCodes.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (employeeCodes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(employeeCodes, lastRow);
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

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshEmployeeCodeList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentEmployeeCode && (
        <EditEmployeeCodeDialog
          open
          onClose={onDialogClose}
          employeeCodeId={currentEmployeeCode.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentEmployeeCode && (
        <DeleteEmployeeCodeDialog
          open
          employeeCode={currentEmployeeCode}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentEmployeeCode && (
        <ViewEmployeeCodeDialog
          open
          onClose={onDialogClose}
          employeeCodeId={currentEmployeeCode.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<EmployeeCode>>
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

EmployeeCodeList.displayName = "EmployeeCodeList";
