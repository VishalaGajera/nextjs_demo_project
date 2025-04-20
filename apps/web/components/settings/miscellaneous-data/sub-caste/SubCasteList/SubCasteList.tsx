"use client";

import { AgGrid, defaultPageSize, toasts } from "@codezee/sixtify-brahma";
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
import { DeleteSubCasteDialog } from "../Dialogs/DeleteSubCasteDialog";
import { EditSubCasteDialog } from "../Dialogs/EditSubCasteDialog";
import { useEditSubCaste } from "../Dialogs/hooks/useEditSubCaste";
import { InActiveSubCasteDialog } from "../Dialogs/InActiveSubCasteDialog";
import { ViewSubCasteDialog } from "../Dialogs/ViewSubCasteDialog";
import type { SubCasteListRef } from "../SubCaste";
import type { SubCaste } from "./hooks/useGetSubCastes";
import { useGetSubCastesQueryFn } from "./hooks/useGetSubCastes";
import { useSubCasteColumns } from "./hooks/useSubCasteColumns";
export type SubCasteListProps = { search?: string | null };

export const SubCasteList = forwardRef(
  (
    { search = null }: SubCasteListProps,
    ref: ForwardedRef<SubCasteListRef>
  ) => {
    const gridRef = useRef<AgGridReact<SubCaste>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentSubCaste, setCurrentSubCaste] = useState<SubCaste>();

    const [loading, setLoading] = useState(false);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const sectionId = currentSubCaste?.id ?? "";

    const { mutate } = useEditSubCaste({
      subCasteId: sectionId,
      options: {
        onSuccess: (data) => {
          onDialogClose();
          refreshCache();
          toasts.success({ title: data.message });
        },
      },
    });

    const { columns } = useSubCasteColumns({
      onAction: (actionType, subCaste) => {
        onDialogOpen(actionType);
        setCurrentSubCaste(subCaste);
      },
      loading,
      onActive: () => {
        mutate({ is_active: true });
      },
    });

    const { getSubCastes } = useGetSubCastesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { subCastes, totalCount } = await getSubCastes({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (subCastes.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (subCastes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(subCastes, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<SubCaste>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshSubCasteList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentSubCaste && (
        <EditSubCasteDialog
          open
          onClose={onDialogClose}
          subCasteId={currentSubCaste.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentSubCaste && (
        <ViewSubCasteDialog
          open
          onClose={onDialogClose}
          subCasteId={currentSubCaste.id}
        />
      ),
      delete: currentSubCaste && (
        <DeleteSubCasteDialog
          open
          subCaste={currentSubCaste}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      action: currentSubCaste && (
        <InActiveSubCasteDialog
          open
          subCasteId={currentSubCaste.id}
          subCasteName={currentSubCaste.sub_caste_name}
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
        <AgGrid<AgDataWithActions<SubCaste>>
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

SubCasteList.displayName = "subCasteList";
