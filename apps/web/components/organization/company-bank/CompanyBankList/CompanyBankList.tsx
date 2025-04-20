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
import type { CompanyBankListRef } from "../../../../app/organization/company-bank/page";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../types/agGrid";
import type { DialogRenderer } from "../../../../types/dialogs";
import { filterSearchParams } from "../../../../utils/helper";
import { DeleteCompanyBankDialog } from "../Dialogs/DeleteCompanyBankDialog";
import { EditCompanyBankDialog } from "../Dialogs/EditCompanyBankDialog";
import { ViewCompanyBankDialog } from "../Dialogs/ViewCompanyBankDialog";
import { useCompanyBankColumns } from "./hooks/useCompanyBankColumns";
import {
  type CompanyBank,
  useGetCompanyBanksQueryFn,
} from "./hooks/useGetCompanyBanks";

export type CompanyListProps = { search?: string | null };

export const CompanyBankList = forwardRef(
  (
    { search = null }: CompanyListProps,
    ref: ForwardedRef<CompanyBankListRef>
  ) => {
    const gridRef = useRef<AgGridReact<CompanyBank>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentCompanyBank, setCurrentCompanyBank] = useState<CompanyBank>();

    const [loading, setLoading] = useState(false);

    const { columns } = useCompanyBankColumns({
      onAction: (actionType, companyBank) => {
        onDialogOpen(actionType);
        setCurrentCompanyBank(companyBank);
      },
      loading,
    });

    const { getCompanyBanks } = useGetCompanyBanksQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { banks, totalCount } = await getCompanyBanks({
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

    const onGridReady = useCallback((params: GridReadyEvent) => {
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
      refreshCompanyBankList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentCompanyBank && (
        <EditCompanyBankDialog
          open
          onClose={onDialogClose}
          companyBankId={currentCompanyBank.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentCompanyBank && (
        <DeleteCompanyBankDialog
          open
          companyBank={currentCompanyBank}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentCompanyBank && (
        <ViewCompanyBankDialog
          open
          onClose={onDialogClose}
          companyBankId={currentCompanyBank.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<CompanyBank>>
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

CompanyBankList.displayName = "CompanyBankList";
