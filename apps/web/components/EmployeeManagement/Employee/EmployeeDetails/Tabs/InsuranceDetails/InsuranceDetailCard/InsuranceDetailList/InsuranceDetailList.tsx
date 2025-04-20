"use client";

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
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { PageProps } from "../../../../../../../../app/employee-management/employee/[employeeId]/page";
import { useDialogActions } from "../../../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../../../types/dialogs";
import { DeleteInsuranceDetailDialog } from "../Dialogs/DeleteInsuranceDetailDialog";
import { EditInsuranceDetailDialog } from "../Dialogs/EditInsuranceDetailDialog";
import { ViewInsuranceDetailDialog } from "../Dialogs/ViewInsuranceDetailDialog";
import type { InsuranceDetailsRef } from "../InsuranceDetailCard";
import {
  useGetInsuranceDetailQueryFn,
  type InsuranceDetail,
} from "./hooks/useGetInsuranceDetail";
import { useInsuranceDetailColumns } from "./hooks/useInsuranceDetailColumns";

type InsuranceDetailListProps = Readonly<PageProps["params"]>;

export type InsuranceDetailRef = {
  refreshInsuranceDetailList: () => void;
};

export const InsuranceDetailList = forwardRef(
  (
    { employeeId }: InsuranceDetailListProps,
    ref: ForwardedRef<InsuranceDetailsRef>
  ) => {
    const gridRef = useRef<AgGridReact<InsuranceDetail>>(null);

    const [loading, setLoading] = useState(false);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentInsuranceDetail, setCurrentInsuranceDetail] =
      useState<InsuranceDetail>();

    const { columns } = useInsuranceDetailColumns({
      onAction: (actionType, education) => {
        onDialogOpen(actionType);
        setCurrentInsuranceDetail(education);
      },
      loading,
    });

    const { getInsuranceDetail } = useGetInsuranceDetailQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { startRow, endRow, sortModel } = params;

      const { insuranceDetails, totalCount } = await getInsuranceDetail({
        employeeId,
        body: {
          startRow,
          endRow,
          sortModel,
        },
      });

      let lastRow = -1;

      if (insuranceDetails.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (insuranceDetails.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(insuranceDetails, lastRow);
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
      refreshInsuranceDetailsList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentInsuranceDetail && (
        <EditInsuranceDetailDialog
          open
          employeeId={employeeId}
          onClose={onDialogClose}
          onEdit={refreshCache}
          insuranceDetailId={currentInsuranceDetail.id}
        />
      ),
      delete: currentInsuranceDetail && (
        <DeleteInsuranceDetailDialog
          open
          employeeId={employeeId}
          onClose={onDialogClose}
          onDeleteSuccess={refreshCache}
          insuranceDetail={currentInsuranceDetail}
        />
      ),
      view: currentInsuranceDetail && (
        <ViewInsuranceDetailDialog
          open
          employeeId={employeeId}
          onClose={onDialogClose}
          insuranceDetailId={currentInsuranceDetail.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<InsuranceDetail>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(57vh - 150px)"
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

InsuranceDetailList.displayName = "InsuranceDetailList";
