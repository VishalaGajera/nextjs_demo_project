"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { BankPayScheduleListRef } from "../../../../app/bank-configurations/bank-pay-schedule/page";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../types/agGrid";
import type { DialogRenderer } from "../../../../types/dialogs";
import { filterSearchParams } from "../../../../utils/helper";
import { DeleteBankPayScheduleDialog } from "../Dialogs/DeleteBankPayScheduleDialog";
import { useBankPayScheduleColumns } from "./hooks/useBankPayScheduleColumns";
import type { BankPaySchedule } from "./hooks/useGetBankPayScheduleList";
import { useGetBankPayScheduleListQueryFn } from "./hooks/useGetBankPayScheduleList";

export type BankPayScheduleListProps = { search?: string | null };

export const BankPayScheduleList = forwardRef(
  (
    { search = null }: BankPayScheduleListProps,
    ref: ForwardedRef<BankPayScheduleListRef>
  ) => {
    const router = useRouter();

    const gridRef = useRef<AgGridReact<BankPaySchedule>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentBankPaySchedule, setCurrentBankPaySchedule] =
      useState<BankPaySchedule>();

    const [loading, setLoading] = useState(false);

    const { columns } = useBankPayScheduleColumns({
      onAction: (actionType, bankPaySchedule) => {
        if (actionType === "edit") {
          router.push(
            `/bank-configurations/bank-pay-schedule/${bankPaySchedule.id}`
          );
        } else {
          onDialogOpen(actionType);
        }
        setCurrentBankPaySchedule(bankPaySchedule);
      },
      loading,
    });

    const { getBankPayScheduleList } = useGetBankPayScheduleListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { BankPayScheduleGroups, totalCount } =
        await getBankPayScheduleList({
          body: {
            ...params,
            quickFilter: filterSearchParams(search),
          },
        });

      let lastRow = -1;

      if (BankPayScheduleGroups.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (BankPayScheduleGroups.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(BankPayScheduleGroups, lastRow);
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
      refreshBankPayScheduleList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      delete: currentBankPaySchedule && (
        <DeleteBankPayScheduleDialog
          open
          bankPaySchedule={currentBankPaySchedule}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <Fragment>
        <AgGrid<AgDataWithActions<BankPaySchedule>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 160px)"
          pagination
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </Fragment>
    );
  }
);

BankPayScheduleList.displayName = "BankPayScheduleList";
