"use client";

import { AgGrid, defaultPageSize, toasts } from "@codezee/sixtify-brahma";
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
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import type { DesignationListRef } from "../designation";
import { DeleteDesignationDialog } from "../Dialogs/DeleteDesignationDialog";
import { EditDesignationDialog } from "../Dialogs/EditDesignationDialog";
import { useEditDesignation } from "../Dialogs/hooks/useEditDesignation";
import { InActiveDesignationDialog } from "../Dialogs/InActiveDesignationDialog";
import { ViewDesignationDialog } from "../Dialogs/ViewDesignationDialog";
import { useDesignationColumns } from "./hooks/useDesignationColumns";
import {
  type Designation,
  useGetDesignationsQueryFn,
} from "./hooks/useDesignations";

export type DesignationListProps = { search?: string | null };

export const DesignationList = forwardRef(
  (
    { search = null }: DesignationListProps,
    ref: ForwardedRef<DesignationListRef>
  ) => {
    const gridRef = useRef<AgGridReact<Designation>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentDesignation, setCurrentDesignation] = useState<Designation>();

    const [loading, setLoading] = useState(false);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const sectionId = currentDesignation?.id ?? "";

    const { mutate } = useEditDesignation({
      designationId: sectionId,
      options: {
        onSuccess: (data) => {
          onDialogClose();
          refreshCache();
          toasts.success({ title: data.message });
        },
      },
    });

    const { columns } = useDesignationColumns({
      onAction: (actionType, designation) => {
        onDialogOpen(actionType);
        setCurrentDesignation(designation);
      },
      loading,
      onActive: () => {
        mutate({ is_active: true });
      },
    });

    const { getDesignations } = useGetDesignationsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { designations, totalCount } = await getDesignations({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (designations.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (designations.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(designations, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<Designation>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useImperativeHandle(ref, () => ({
      refreshDesignationList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      edit: currentDesignation && (
        <EditDesignationDialog
          open
          onClose={onDialogClose}
          designationId={currentDesignation.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentDesignation && (
        <ViewDesignationDialog
          open
          onClose={onDialogClose}
          designationId={currentDesignation.id}
        />
      ),
      delete: currentDesignation && (
        <DeleteDesignationDialog
          open
          designation={currentDesignation}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      action: currentDesignation && (
        <InActiveDesignationDialog
          open
          designationId={currentDesignation.id}
          designationName={currentDesignation.designation_name}
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
        <AgGrid<AgDataWithActions<Designation>>
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

DesignationList.displayName = "DesignationList";
