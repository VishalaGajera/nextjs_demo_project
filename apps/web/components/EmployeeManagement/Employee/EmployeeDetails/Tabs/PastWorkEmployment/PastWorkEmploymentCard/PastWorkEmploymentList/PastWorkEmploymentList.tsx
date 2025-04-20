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
import { DeletePastWorkEmploymentDialog } from "../Dialogs/DeletePastWorkEmploymentDialog";
import { EditPastWorkEmploymentDialog } from "../Dialogs/EditPastWorkEmploymentDialog";
import { ViewPastWorkEmploymentDialog } from "../Dialogs/ViewPastWorkEmploymentDialog";
import type { PastWorkEmploymentListRef } from "../PastWorkEmploymentCard";
import type { PastWorkEmployment } from "./hooks/useGetPastWorkEmployments";
import { useGetPastWorkEmploymentsQueryFn } from "./hooks/useGetPastWorkEmployments";
import { usePastWorkEmploymentColumns } from "./hooks/usePastWorkEmploymentColumns";

type PastWorkEmploymentListProps = Readonly<PageProps["params"]>;

export const PastWorkEmploymentList = forwardRef(
  (
    { employeeId }: PastWorkEmploymentListProps,
    ref: ForwardedRef<PastWorkEmploymentListRef>
  ) => {
    const gridRef = useRef<AgGridReact<PastWorkEmployment>>(null);

    const { openedDialog, onDialogOpen, onDialogClose } = useDialogActions();

    const [currentPastWorkEmployment, setCurrentPastWorkEmployment] =
      useState<PastWorkEmployment>();

    const [loading, setLoading] = useState(false);

    const { columns } = usePastWorkEmploymentColumns({
      onAction: (actionType, pastWorkEmployment) => {
        onDialogOpen(actionType);
        setCurrentPastWorkEmployment(pastWorkEmployment);
      },
      loading,
    });

    const { getPastWorkEmployments } = useGetPastWorkEmploymentsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { startRow, endRow, sortModel } = params;

      const { pastWorkEmployments, totalCount } = await getPastWorkEmployments({
        body: {
          startRow,
          endRow,
          sortModel,
        },
        employeeId,
      });

      let lastRow = -1;

      if (pastWorkEmployments.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (pastWorkEmployments.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(pastWorkEmployments, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => ({
      refreshWorkEmploymentList() {
        refreshCache();
      },
    }));

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    const dialogRenderer: DialogRenderer = {
      edit: currentPastWorkEmployment && (
        <EditPastWorkEmploymentDialog
          open
          onClose={onDialogClose}
          pastWorkEmploymentId={currentPastWorkEmployment.id}
          onEditSuccess={refreshCache}
          employeeId={employeeId}
        />
      ),
      delete: currentPastWorkEmployment && (
        <DeletePastWorkEmploymentDialog
          open
          pastWorkEmployment={currentPastWorkEmployment}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
          employeeId={employeeId}
        />
      ),
      view: currentPastWorkEmployment && (
        <ViewPastWorkEmploymentDialog
          open
          onClose={onDialogClose}
          pastWorkEmploymentId={currentPastWorkEmployment.id}
          employeeId={employeeId}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<PastWorkEmployment>>
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

PastWorkEmploymentList.displayName = "PastWorkEmploymentList";
