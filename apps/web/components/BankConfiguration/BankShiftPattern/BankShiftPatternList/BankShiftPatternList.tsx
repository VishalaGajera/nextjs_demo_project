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
import type { BankShiftPatternListRef } from "../../../../app/bank-configurations/bank-shift-pattern/page";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { filterSearchParams } from "../../../../utils/helper";
import { DeleteBankShiftPatternDialog } from "../Dialogs/DeleteBankShiftPatternDialog";
import { EditBankShiftPatternDialog } from "../Dialogs/EditBankShiftPatternDialog";
import { ViewBankShiftPatternDialog } from "../Dialogs/ViewBankShiftPatternDialog";
import { useBankShiftPatternColumns } from "./hooks/useBankShiftPatternColumns";
import {
  useGetBankShiftPatternsQueryFn,
  type BankShiftPattern,
} from "./hooks/useGetBankShiftPatterns";

export type BankShiftPatternListProps = { search?: string | null };

export const BankShiftPatternList = forwardRef(
  (
    { search = null }: BankShiftPatternListProps,
    ref: ForwardedRef<BankShiftPatternListRef>
  ) => {
    const gridRef = useRef<AgGridReact<BankShiftPattern>>(null);

    const [loading, setLoading] = useState(false);

    const [currentBankShiftPattern, setCurrentBankShiftPattern] =
      useState<BankShiftPattern>();

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const { columns } = useBankShiftPatternColumns({
      onAction: (actionType, bankshiftPattern) => {
        onDialogOpen(actionType);
        setCurrentBankShiftPattern(bankshiftPattern);
      },
      loading,
    });

    const { getBankShiftPatterns } = useGetBankShiftPatternsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { bankShiftPatterns, totalCount } = await getBankShiftPatterns({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (bankShiftPatterns.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (bankShiftPatterns.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(bankShiftPatterns, lastRow);
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
      refreshBankShiftPatternList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      edit: currentBankShiftPattern && (
        <EditBankShiftPatternDialog
          open
          bankShiftPatternId={currentBankShiftPattern.id}
          onEditSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      delete: currentBankShiftPattern && (
        <DeleteBankShiftPatternDialog
          open
          bankShiftPattern={currentBankShiftPattern}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentBankShiftPattern && (
        <ViewBankShiftPatternDialog
          open
          bankShiftPatternId={currentBankShiftPattern.id}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<BankShiftPattern>
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

BankShiftPatternList.displayName = "BankShiftPatternList";
