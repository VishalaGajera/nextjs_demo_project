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
import { DeleteEducationDialog } from "../Dialogs/DeleteEducationDialog";
import { EditEducationDialog } from "../Dialogs/EditEducationDialog";
import { ViewEducationDialog } from "../Dialogs/ViewEducationDialog";
import type { EducationDetailsRef } from "../EducationDetailCard";
import { useEducationDetailsColumns } from "./hooks/useEducationDetailsColumns";
import {
  useGetEducationDetailsQueryFn,
  type EducationDetails,
} from "./hooks/useGetEducationDetails";

type EducationDetailListProps = Readonly<PageProps["params"]>;

export const EducationDetailList = forwardRef(
  (
    { employeeId }: EducationDetailListProps,
    ref: ForwardedRef<EducationDetailsRef>
  ) => {
    const gridRef = useRef<AgGridReact<EducationDetails>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentEducationDetail, setCurrentEducationDetail] =
      useState<EducationDetails>();

    const [loading, setLoading] = useState(false);

    const { columns } = useEducationDetailsColumns({
      onAction: (actionType, education) => {
        onDialogOpen(actionType);
        setCurrentEducationDetail(education);
      },
      loading,
    });

    const { getEducationDetail } = useGetEducationDetailsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { startRow, endRow, sortModel } = params;

      const { employeeEducations, totalCount } = await getEducationDetail({
        body: {
          startRow,
          endRow,
          sortModel,
        },
        employeeId,
      });

      let lastRow = -1;

      if (employeeEducations.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (employeeEducations.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(employeeEducations, lastRow);
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
      refreshEducationDetailList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentEducationDetail && (
        <EditEducationDialog
          open
          employeeId={employeeId}
          onClose={onDialogClose}
          onEdit={refreshCache}
          educationDetailId={currentEducationDetail.id}
        />
      ),
      delete: currentEducationDetail && (
        <DeleteEducationDialog
          open
          employeeId={employeeId}
          onClose={onDialogClose}
          onDeleteSuccess={refreshCache}
          educationDetails={currentEducationDetail}
        />
      ),
      view: currentEducationDetail && (
        <ViewEducationDialog
          open
          employeeId={employeeId}
          onClose={onDialogClose}
          educationDetailId={currentEducationDetail.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<EducationDetails>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(51vh - 160px)"
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

EducationDetailList.displayName = "EducationDetailList";
