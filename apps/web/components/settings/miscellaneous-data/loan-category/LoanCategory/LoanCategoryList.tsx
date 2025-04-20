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
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeleteLoanCategoryDialog } from "../Dialogs/DeleteLoanCategoryDialog";
import { EditLoanCategoryDialog } from "../Dialogs/EditLoanCategoryDialog";
import { ViewLoanCategoryDialog } from "../Dialogs/ViewLoanCategoryDialog";
import type { LoanCategoryListRef } from "../LoanCategory";
import type { LoanCategory } from "./hooks/useGetLoanCategories";
import { useGetLoanCategoriesQueryFn } from "./hooks/useGetLoanCategories";
import { useLoanCategoryColumns } from "./hooks/useLoanCategoryColumns";

export type LoanCategoryListProps = { search?: string | null };

export const LoanCategoryList = forwardRef(
  (
    { search = null }: LoanCategoryListProps,
    ref: ForwardedRef<LoanCategoryListRef>
  ) => {
    const gridRef = useRef<AgGridReact<LoanCategory>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentLoanCategory, setCurrentLoanCategory] =
      useState<LoanCategory>();

    const [loading, setLoading] = useState(false);

    const { columns } = useLoanCategoryColumns({
      onAction: (actionType, loanCategory) => {
        onDialogOpen(actionType);
        setCurrentLoanCategory(loanCategory);
      },
      loading,
    });

    const { getLoanCategories } = useGetLoanCategoriesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { loanCategories, totalCount } = await getLoanCategories({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (loanCategories.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (loanCategories.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(loanCategories, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<LoanCategory>) => {
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
      refreshLoanCategoryList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentLoanCategory && (
        <EditLoanCategoryDialog
          open
          onClose={onDialogClose}
          loanCategoryId={currentLoanCategory.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentLoanCategory && (
        <DeleteLoanCategoryDialog
          open
          loanCategory={currentLoanCategory}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentLoanCategory && (
        <ViewLoanCategoryDialog
          open
          onClose={onDialogClose}
          loanCategoryId={currentLoanCategory.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<LoanCategory>>
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

LoanCategoryList.displayName = "LoanCategoryList";
