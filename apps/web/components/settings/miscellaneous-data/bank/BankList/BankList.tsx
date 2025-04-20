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
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import type { BankListRef } from "../Bank";
import { DeleteBankDialog } from "../Dialogs/DeleteBankDialog";
import { EditBankDialog } from "../Dialogs/EditBankDialog";
import { ViewBankDialog } from "../Dialogs/ViewBankDialog";
import { useBankColumns } from "./hooks/useBankColumns";
import { useGetBanksQueryFn, type Bank } from "./hooks/useGetBanks";

export type BankListProps = { search?: string | null };

export const BankList = forwardRef(
  ({ search = null }: BankListProps, ref: ForwardedRef<BankListRef>) => {
    const gridRef = useRef<AgGridReact<Bank>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentBank, setCurrentBank] = useState<Bank>();

    const [loading, setLoading] = useState(false);

    const { columns } = useBankColumns({
      onAction: (actionType, bank) => {
        onDialogOpen(actionType);
        setCurrentBank(bank);
      },
      loading,
    });

    const { getBanks } = useGetBanksQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { banks, totalCount } = await getBanks({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (banks.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (banks.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(banks, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<Bank>) => {
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
      refreshBankList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentBank && (
        <EditBankDialog
          open
          onClose={onDialogClose}
          bankId={currentBank.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentBank && (
        <DeleteBankDialog
          open
          bank={currentBank}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentBank && (
        <ViewBankDialog open onClose={onDialogClose} bankId={currentBank.id} />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<Bank>>
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

BankList.displayName = "BankList";
