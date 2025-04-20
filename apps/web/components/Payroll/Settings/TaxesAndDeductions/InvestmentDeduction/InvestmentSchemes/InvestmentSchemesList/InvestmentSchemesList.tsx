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
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../../utils/helper";
import { DeleteInvestmentSchemesDialog } from "../Dialogs/DeleteInvestmentSchemesDialog";
import { EditInvestmentSchemesDialog } from "../Dialogs/EditInvestmentSchemesDialog";
import { ViewInvestmentSchemesDialog } from "../Dialogs/ViewInvestmentSchemesDialog";
import type { InvestmentSchemesListRef } from "../InvestmentSchemes";
import {
  useGetInvestmentSchemesListQueryFn,
  type InvestmentSchemesRecord,
} from "./hooks/useGetInvestmentSchemesList";
import { useInvestmentSchemesColumns } from "./hooks/useInvestmentSchemesListColumns";

export type InvestmentSchemesListProps = { search?: string | null };

export const InvestmentSchemesList = forwardRef(
  (
    { search = null }: InvestmentSchemesListProps,
    ref: ForwardedRef<InvestmentSchemesListRef>
  ) => {
    const gridRef = useRef<AgGridReact<InvestmentSchemesRecord>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentInvestmentScheme, setCurrentInvestmentScheme] =
      useState<InvestmentSchemesRecord>();

    const [loading, setLoading] = useState(false);

    const { columns } = useInvestmentSchemesColumns({
      onAction: (actionType, investmentScheme) => {
        onDialogOpen(actionType);
        setCurrentInvestmentScheme(investmentScheme);
      },
      loading,
    });

    const { getInvestmentSchemesList } = useGetInvestmentSchemesListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { investmentSchemes, totalCount } = await getInvestmentSchemesList({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (investmentSchemes.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (investmentSchemes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(investmentSchemes, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback(
      (params: GridReadyEvent<InvestmentSchemesRecord>) => {
        params.api.setGridOption("datasource", dataSource);
      },
      []
    );

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const dialogRenderer: DialogRenderer = {
      edit: currentInvestmentScheme && (
        <EditInvestmentSchemesDialog
          open
          onClose={onDialogClose}
          investmentSchemesId={currentInvestmentScheme.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentInvestmentScheme && (
        <ViewInvestmentSchemesDialog
          open
          onClose={onDialogClose}
          investmentSchemesId={currentInvestmentScheme.id}
        />
      ),
      delete: currentInvestmentScheme && (
        <DeleteInvestmentSchemesDialog
          open
          onClose={onDialogClose}
          investmentSchemesData={currentInvestmentScheme}
          onDeleteSuccess={refreshCache}
        />
      ),
    };

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshInvestmentSchemesList() {
        refreshCache();
      },
    }));

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<InvestmentSchemesRecord>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 270px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

InvestmentSchemesList.displayName = "InvestmentSchemesList";
