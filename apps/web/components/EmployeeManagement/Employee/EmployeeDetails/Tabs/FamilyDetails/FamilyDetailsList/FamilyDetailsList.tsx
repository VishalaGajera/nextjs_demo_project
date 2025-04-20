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
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { DeleteFamilyDetailsDialog } from "../Dialog/DeleteFamilyDetailsDialog";
import { EditFamilyDetailsDialog } from "../Dialog/EditFamilyDetailsDialog";
import type { FamilyDetails } from "../Dialog/hooks/useAddFamilyDetails";
import { ViewFamilyDetailsDialog } from "../Dialog/ViewFamilyDetailsDialog";
import type { FamilyDetailsListRef } from "../FamilyDetails";
import { useGetFamilyDetailsQueryFn } from "./hooks/useGetFamilyDetails";
import { useGetFamilyDetailsColumns } from "./hooks/useGetFamilyDetailsColumns";

type FamilyDetailsListProps = {
  employeeId: string;
};
export const FamilyDetailsList = forwardRef(
  (
    { employeeId }: FamilyDetailsListProps,
    ref: ForwardedRef<FamilyDetailsListRef>
  ) => {
    const gridRef = useRef<AgGridReact<FamilyDetails>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [loading, setLoading] = useState(false);

    const [currentFamilyDetails, setCurrentFamilyDetails] =
      useState<FamilyDetails>();

    const { column } = useGetFamilyDetailsColumns({
      onAction: (actionType, companyBank) => {
        onDialogOpen(actionType);
        setCurrentFamilyDetails(companyBank);
      },
      loading,
    });

    const { getFamilyDetails } = useGetFamilyDetailsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { startRow, endRow, sortModel } = params;

      const { familyDetails, totalCount } = await getFamilyDetails({
        employeeId,
        body: {
          startRow,
          endRow,
          sortModel,
          responseFields: [
            "id",
            "name",
            "date_of_birth",
            "gender",
            "blood_group",
            "relation",
            "profession",
            "nationality",
            "address",
          ],
        },
      });

      let lastRow = -1;

      if (familyDetails.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (familyDetails.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(familyDetails, lastRow);
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
      refreshFamilyDetailsList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, []);

    const dialogRenderer: DialogRenderer = {
      edit: currentFamilyDetails && (
        <EditFamilyDetailsDialog
          employeeId={employeeId}
          onClose={onDialogClose}
          open
          familyId={currentFamilyDetails.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentFamilyDetails && (
        <DeleteFamilyDetailsDialog
          employeeId={employeeId}
          onClose={onDialogClose}
          open
          familyDetails={currentFamilyDetails}
          onDeleteSuccess={refreshCache}
        />
      ),
      view: currentFamilyDetails && (
        <ViewFamilyDetailsDialog
          employeeId={employeeId}
          onClose={onDialogClose}
          open
          familyId={currentFamilyDetails.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<FamilyDetails>>
          ref={gridRef}
          columnDefs={column}
          onGridReady={onGridReady}
          height="calc(57vh - 150px)"
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

FamilyDetailsList.displayName = "FamilyDetailsList";
