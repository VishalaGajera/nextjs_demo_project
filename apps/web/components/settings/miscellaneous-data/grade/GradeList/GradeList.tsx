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
import { DeleteGradeDialog } from "../Dialogs/DeleteGradeDialog";
import { EditGradeDialog } from "../Dialogs/EditGradeDialog";
import { useEditGrade } from "../Dialogs/hooks/useEditGrade";
import { InActiveGradeDialog } from "../Dialogs/InActiveGradeDialog";
import { ViewGradeDialog } from "../Dialogs/ViewGradeDialog";
import type { GradeListRef } from "../Grade";
import { type Grade, useGetGradesQueryFn } from "./hooks/useGetGrades";
import { useGradeColumns } from "./hooks/useGradeColumns";

export type GradeListProps = { search?: string | null };

export const GradeList = forwardRef(
  ({ search = null }: GradeListProps, ref: ForwardedRef<GradeListRef>) => {
    const gridRef = useRef<AgGridReact<Grade>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentGrade, setCurrentGrade] = useState<Grade>();

    const [loading, setLoading] = useState(false);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const sectionId = currentGrade?.id ?? "";

    const { mutate } = useEditGrade({
      gradeId: sectionId,
      options: {
        onSuccess: (data) => {
          onDialogClose();
          refreshCache();
          toasts.success({ title: data.message });
        },
      },
    });

    const { columns } = useGradeColumns({
      onAction: (actionType, grade) => {
        onDialogOpen(actionType);
        setCurrentGrade(grade);
      },
      loading,
      onActive: () => {
        mutate({ is_active: true });
      },
    });

    const { getGrades } = useGetGradesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { grades, totalCount } = await getGrades({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (grades.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (grades.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(grades, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useImperativeHandle(ref, () => ({
      refreshGradeList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      edit: currentGrade && (
        <EditGradeDialog
          open
          onClose={onDialogClose}
          gradeId={currentGrade.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentGrade && (
        <ViewGradeDialog
          open
          onClose={onDialogClose}
          gradeId={currentGrade.id}
        />
      ),
      delete: currentGrade && (
        <DeleteGradeDialog
          open
          grade={currentGrade}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      action: currentGrade && (
        <InActiveGradeDialog
          open
          gradeId={currentGrade.id}
          gradeName={currentGrade.grade_name}
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
        <AgGrid<AgDataWithActions<Grade>>
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

GradeList.displayName = "GradeList";
