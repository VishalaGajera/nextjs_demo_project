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
import type { CompanyListRef } from "../../../../app/organization/company/page";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../types/agGrid";
import type { DialogRenderer } from "../../../../types/dialogs";
import { filterSearchParams } from "../../../../utils/helper";
import { DeleteCompanyDialog } from "../Dialogs/DeleteCompanyDialog";
import { useCompanyColumns } from "./hooks/useCompanyColumns";
import { type Company, useGetCompaniesQueryFn } from "./hooks/useGetCompanies";

export type CompanyListProps = { search?: string | null };

export const CompanyList = forwardRef(
  ({ search = null }: CompanyListProps, ref: ForwardedRef<CompanyListRef>) => {
    const gridRef = useRef<AgGridReact<Company>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentCompany, setCurrentCompany] = useState<Company>();

    const [loading, setLoading] = useState(false);

    const { column } = useCompanyColumns({
      onAction: (actionType, company) => {
        onDialogOpen(actionType);
        setCurrentCompany(company);
      },
      loading,
    });

    const { getCompanies } = useGetCompaniesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { companies, totalCount } = await getCompanies({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (companies.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (companies.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(companies, lastRow);
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
      refreshCompanyList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      delete: currentCompany && (
        <DeleteCompanyDialog
          open
          company={currentCompany}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<Company>>
          ref={gridRef}
          columnDefs={column}
          onGridReady={onGridReady}
          height="calc(95vh - 160px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

CompanyList.displayName = "CompanyList";
