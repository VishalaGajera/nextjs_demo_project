import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
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

import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../../utils/helper";
import { DeleteBankShiftDialog } from "../Dialogs/DeleteBankShiftDialog";
import { EditBankShiftDialog } from "../Dialogs/EditBankShiftDialog";
import { ViewBankShiftDialog } from "../Dialogs/ViewBankShiftDialog copy";
import { useBankShiftListColumns } from "./hooks/useBankShiftListColumns";
import type { BankShiftDetail } from "./hooks/useGetBankShiftList";
import { useGetBankShiftListQueryFn } from "./hooks/useGetBankShiftList";
export type BankShiftListRef = {
  refreshBankShiftList: () => void;
};
export type BankShiftListProps = { search?: string | null };

export const BankShiftList = forwardRef(
  (
    { search = null }: BankShiftListProps,
    ref: ForwardedRef<BankShiftListRef>
  ) => {
    const gridRef = useRef<AgGridReact<BankShiftDetail>>(null);

    const [loading, setLoading] = useState(false);

    const [currentBankShift, setCurrentBankShift] = useState<BankShiftDetail>();

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const { columns } = useBankShiftListColumns({
      onAction: (actionType, bankshift) => {
        onDialogOpen(actionType);
        setCurrentBankShift(bankshift);
      },
      loading,
    });

    const { getBankShiftDetail } = useGetBankShiftListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { bankShiftTypes, totalCount } = await getBankShiftDetail({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (bankShiftTypes?.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (bankShiftTypes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(bankShiftTypes, lastRow);
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
      refreshBankShiftList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      delete: currentBankShift && (
        <DeleteBankShiftDialog
          open
          bankShiftType={currentBankShift}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      edit: currentBankShift && (
        <EditBankShiftDialog
          open
          onClose={onDialogClose}
          bankshiftId={currentBankShift.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentBankShift && (
        <ViewBankShiftDialog
          open
          onClose={onDialogClose}
          bankshiftId={currentBankShift.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<BankShiftDetail>>
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

BankShiftList.displayName = "BankShiftList";
