"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import {
  type ForwardedRef,
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { PayScheduleSetupListRef } from "../../../../../app/payroll/settings/pay-schedule-setup/page";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeletePayScheduleSetupDialog } from "../Dialogs/DeletePayScheduleSetupDialog";
import {
  type PayScheduleSetup,
  useGetPayScheduleSetupListQueryFn,
} from "./hooks/useGetPayScheduleSetupList";
import { usePayScheduleSetupColumns } from "./hooks/usePayScheduleSetupColumns";
export type PayScheduleListProps = { search?: string | null };

export const PayScheduleList = forwardRef(
  (
    { search = null }: PayScheduleListProps,
    ref: ForwardedRef<PayScheduleSetupListRef>
  ) => {
    const router = useRouter();

    const gridRef = useRef<AgGridReact<PayScheduleSetup>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentPayScheduleSetup, setCurrentPayScheduleSetup] =
      useState<PayScheduleSetup>();

    const [loading, setLoading] = useState(false);

    const { columns } = usePayScheduleSetupColumns({
      onAction: (actionType, payScheduleSetup) => {
        if (actionType === "edit") {
          router.push(
            `/payroll/settings/pay-schedule-setup/${payScheduleSetup.id}`
          );
        } else {
          onDialogOpen(actionType);
        }
        setCurrentPayScheduleSetup(payScheduleSetup);
      },
      loading,
    });

    const { getPayScheduleSetupList } = useGetPayScheduleSetupListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { payScheduleGroups, totalCount } = await getPayScheduleSetupList({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (payScheduleGroups.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (payScheduleGroups.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(payScheduleGroups, lastRow);
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
      refreshPayScheduleSetupList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      delete: currentPayScheduleSetup && (
        <DeletePayScheduleSetupDialog
          open
          payScheduleSetup={currentPayScheduleSetup}
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
        <AgGrid<AgDataWithActions<PayScheduleSetup>>
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

PayScheduleList.displayName = "PayScheduleList";
