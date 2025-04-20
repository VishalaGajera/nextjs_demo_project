"use client";

import { AgGrid, defaultPageSize, toasts } from "@codezee/sixtify-brahma";
import type {
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
  useRef,
  useState,
  type ForwardedRef,
} from "react";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import type { DepartmentListRef } from "../Department";
import { DeleteDepartmentDialog } from "../Dialogs/DeleteDepartmentDialog";
import { EditDepartmentDialog } from "../Dialogs/EditDepartmentDialog";
import { useEditDepartment } from "../Dialogs/hooks/useEditDepartment";
import { InActiveDepartmentDialog } from "../Dialogs/InActiveDepartmentDialog";
import { ViewDepartmentDialog } from "../Dialogs/ViewDepartmentDialog";
import { useDepartmentColumns } from "./hooks/useDepartmentColumns";
import {
  useGetDepartmentsQueryFn,
  type Department,
} from "./hooks/useGetDepartments";

export type DepartmentListProps = { search?: string | null };

export const DepartmentList = forwardRef(
  (
    { search = null }: DepartmentListProps,
    ref: ForwardedRef<DepartmentListRef>
  ) => {
    const gridRef = useRef<AgGridReact<Department>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentDepartment, setCurrentDepartment] = useState<Department>();

    const [loading, setLoading] = useState(false);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const sectionId = currentDepartment?.id ?? "";

    const { mutate } = useEditDepartment({
      departmentId: sectionId,
      options: {
        onSuccess: (data) => {
          onDialogClose();
          refreshCache();
          toasts.success({ title: data.message });
        },
      },
    });

    const { columns } = useDepartmentColumns({
      onAction: (actionType, department) => {
        onDialogOpen(actionType);
        setCurrentDepartment(department);
      },
      loading,
      onActive: () => {
        mutate({ is_active: true });
      },
    });

    const { getDepartments } = useGetDepartmentsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { departments, totalCount } = await getDepartments({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (departments.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (departments.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(departments, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<Department>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshDepartmentList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentDepartment && (
        <EditDepartmentDialog
          open
          onClose={onDialogClose}
          departmentId={currentDepartment.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentDepartment && (
        <ViewDepartmentDialog
          open
          onClose={onDialogClose}
          departmentId={currentDepartment.id}
        />
      ),
      delete: currentDepartment && (
        <DeleteDepartmentDialog
          open
          department={currentDepartment}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      action: currentDepartment && (
        <InActiveDepartmentDialog
          open
          departmentId={currentDepartment.id}
          departmentName={currentDepartment.department_name}
          onClose={onDialogClose}
          onSuccess={refreshCache}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<Department>>
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

DepartmentList.displayName = "DepartmentList";
