"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
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
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../utils/helper";
import type { SalaryComponent } from "../../SalaryComponentForm";
import type { DeductionListRef } from "../Deduction";
import { DeleteDeductionDialog } from "../Dialogs/DeleteDeductionDialog";
import { EditDeductionDialog } from "../Dialogs/EditDeductionDialog";
import { ViewDeductionDialog } from "../Dialogs/ViewDeductionDialog";
import { useDeductionColumns } from "./hooks/useDeductionColumns";
import { useGetDeductionsQueryFn } from "./hooks/useGetDeductions";

export type DeductionListProps = { search?: string | null };

export const DeductionList = forwardRef(
  (
    { search = null }: DeductionListProps,
    ref: ForwardedRef<DeductionListRef>
  ) => {
    const gridRef = useRef<AgGridReact<SalaryComponent>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentDeduction, setCurrentDeduction] = useState<SalaryComponent>();

    const [loading, setLoading] = useState(false);

    const { columns } = useDeductionColumns({
      onAction: (actionType, deduction) => {
        onDialogOpen(actionType);
        setCurrentDeduction(deduction);
      },
      loading,
    });

    const { getDeductions } = useGetDeductionsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { deductionComponents, totalCount } = await getDeductions({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (deductionComponents.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (deductionComponents.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(deductionComponents, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback(
      (params: GridReadyEvent<SalaryComponent>) => {
        params.api.setGridOption("datasource", dataSource);
      },
      []
    );

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshDeductionList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentDeduction && (
        <EditDeductionDialog
          open
          onClose={onDialogClose}
          deductionId={currentDeduction.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentDeduction && (
        <DeleteDeductionDialog
          open
          deduction={currentDeduction}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentDeduction && (
        <ViewDeductionDialog
          open
          onClose={onDialogClose}
          deductionId={currentDeduction.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<SalaryComponent>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(89vh - 160px)"
          pagination
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

DeductionList.displayName = "DeductionList";
