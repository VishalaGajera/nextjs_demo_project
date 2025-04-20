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
import type { BusinessUnitListRef } from "../../../../app/organization/business-unit/page";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../types/agGrid";
import type { DialogRenderer } from "../../../../types/dialogs";
import { filterSearchParams } from "../../../../utils/helper";
import { DeleteBusinessUnitDialog } from "../Dialogs/DeleteBusinessUnitDialog";
import { EditBusinessUnitDialog } from "../Dialogs/EditBusinessUnitDialog";
import { ViewBusinessUnitDialog } from "../Dialogs/ViewBusinessUnitDialog";
import { useBusinessUnitColumns } from "./hooks/useBusinessUnitColumns";
import type { BusinessUnit } from "./hooks/useGetBusinessUnitss";
import { useGetBusinessUnitsQueryFn } from "./hooks/useGetBusinessUnitss";

export type BusinessUnitListProps = { search?: string | null };

export const BusinessUnitList = forwardRef(
  (
    { search = null }: BusinessUnitListProps,
    ref: ForwardedRef<BusinessUnitListRef>
  ) => {
    const gridRef = useRef<AgGridReact<BusinessUnit>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentBusinessUnit, setCurrentBusinessUnit] =
      useState<BusinessUnit>();

    const [loading, setLoading] = useState(false);

    const { columns } = useBusinessUnitColumns({
      onAction: (actionType, businessUnit) => {
        onDialogOpen(actionType);
        setCurrentBusinessUnit(businessUnit);
      },
      loading,
    });

    const { getBusinessUnits } = useGetBusinessUnitsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { businessUnits, totalCount } = await getBusinessUnits({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (businessUnits.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (businessUnits.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(businessUnits, lastRow);
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
      refreshBusinessUnitList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      edit: currentBusinessUnit && (
        <EditBusinessUnitDialog
          open
          onClose={onDialogClose}
          businessUnitId={currentBusinessUnit.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentBusinessUnit && (
        <DeleteBusinessUnitDialog
          open
          businessUnit={currentBusinessUnit}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentBusinessUnit && (
        <ViewBusinessUnitDialog
          open
          businessUnitId={currentBusinessUnit.id}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<BusinessUnit>>
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

BusinessUnitList.displayName = "BusinessUnitList";
