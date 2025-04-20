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
import { DeleteWorkTypeDialog } from "../Dialogs/DeleteWorkTypeDialog";
import { EditWorkTypeDialog } from "../Dialogs/EditWorkTypeDialog";
import { useEditWorkType } from "../Dialogs/hooks/useEditWorkType";
import { InActiveWorkTypeDialog } from "../Dialogs/InActiveWorkTypeDialog";
import { ViewWorkTypeDialog } from "../Dialogs/ViewWorkTypeDialog";
import type { WorkTypeListRef } from "../WorkType";
import { useGetWorkTypesQueryFn, type WorkType } from "./hooks/useGetWorkTypes";
import { useWorkTypeColumns } from "./hooks/useWorkTypeColumns";

export type WorkTypeListProps = { search?: string | null };

export const WorkTypeList = forwardRef(
  (
    { search = null }: WorkTypeListProps,
    ref: ForwardedRef<WorkTypeListRef>
  ) => {
    const gridRef = useRef<AgGridReact<WorkType>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentWorkType, setCurrentWorkType] = useState<WorkType>();

    const [loading, setLoading] = useState(false);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const sectionId = currentWorkType?.id ?? "";

    const { mutate } = useEditWorkType({
      workTypeId: sectionId,
      options: {
        onSuccess: (data) => {
          onDialogClose();
          refreshCache();
          toasts.success({ title: data.message });
        },
      },
    });

    const { columns } = useWorkTypeColumns({
      onAction: (actionType, WorkType) => {
        onDialogOpen(actionType);
        setCurrentWorkType(WorkType);
      },
      loading,
      onActive: () => {
        mutate({ is_active: true });
      },
    });

    const { getWorkTypes } = useGetWorkTypesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { workTypes, totalCount } = await getWorkTypes({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (workTypes.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (workTypes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(workTypes, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<WorkType>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshWorkTypeList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentWorkType && (
        <EditWorkTypeDialog
          open
          onClose={onDialogClose}
          workTypeId={currentWorkType.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentWorkType && (
        <ViewWorkTypeDialog
          open
          onClose={onDialogClose}
          workTypeId={currentWorkType.id}
        />
      ),
      delete: currentWorkType && (
        <DeleteWorkTypeDialog
          open
          workType={currentWorkType}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      action: currentWorkType && (
        <InActiveWorkTypeDialog
          open
          workTypeId={currentWorkType.id}
          workTypeName={currentWorkType.work_type_name}
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
        <AgGrid<AgDataWithActions<WorkType>>
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

WorkTypeList.displayName = "WorkTypeList";
