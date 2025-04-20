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

import { DeleteSubDepartmentDialog } from "../Dialogs/DeleteSubDepartmentDialog";
import { EditSubDepartmentDialog } from "../Dialogs/EditSubDepartmentDialog";
import { useEditSubDepartment } from "../Dialogs/hooks/useEditSubDepartment";
import { InActiveSubDepartmentDialog } from "../Dialogs/InActiveSubDepartmentDialog";
import { ViewSubDepartmentDialog } from "../Dialogs/ViewSubDepartmentDialog";
import type { SubDepartmentListRef } from "../SubDepartment";
import {
  useGetSubDepartmentsQueryFn,
  type SubDepartment,
} from "./hooks/useGetSubDepartments";
import { useSubDepartmentColumns } from "./hooks/useSubDepartmentColumns";

export type SubDepartmentListProps = { search?: string | null };

export const SubDepartmentList = forwardRef(
  (
    { search = null }: SubDepartmentListProps,
    ref: ForwardedRef<SubDepartmentListRef>
  ) => {
    const gridRef = useRef<AgGridReact<SubDepartment>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentSubDepartment, setCurrentSubDepartment] =
      useState<SubDepartment>();

    const [loading, setLoading] = useState(false);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const sectionId = currentSubDepartment?.id ?? "";

    const { mutate } = useEditSubDepartment({
      subDepartmentId: sectionId,
      options: {
        onSuccess: (data) => {
          onDialogClose();
          refreshCache();
          toasts.success({ title: data.message });
        },
      },
    });

    const { columns } = useSubDepartmentColumns({
      onAction: (actionType, SubDepartment) => {
        onDialogOpen(actionType);
        setCurrentSubDepartment(SubDepartment);
      },
      loading,
      onActive: () => {
        mutate({ is_active: true });
      },
    });

    const { getSubDepartments } = useGetSubDepartmentsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { subDepartments, totalCount } = await getSubDepartments({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (subDepartments.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (subDepartments.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(subDepartments, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<SubDepartment>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshSubDepartmentList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentSubDepartment && (
        <EditSubDepartmentDialog
          open
          onClose={onDialogClose}
          subDepartmentId={currentSubDepartment.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentSubDepartment && (
        <ViewSubDepartmentDialog
          open
          onClose={onDialogClose}
          subDepartmentId={currentSubDepartment.id}
        />
      ),
      delete: currentSubDepartment && (
        <DeleteSubDepartmentDialog
          open
          subDepartment={currentSubDepartment}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      action: currentSubDepartment && (
        <InActiveSubDepartmentDialog
          open
          subDepartmentId={currentSubDepartment.id}
          subDepartmentName={currentSubDepartment.sub_department_name}
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
        <AgGrid<AgDataWithActions<SubDepartment>>
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

SubDepartmentList.displayName = "SubDepartmentList";
