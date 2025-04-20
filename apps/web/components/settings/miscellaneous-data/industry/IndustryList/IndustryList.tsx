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
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeleteIndustryDialog } from "../Dialogs/DeleteIndustryDialog";
import { EditIndustryDialog } from "../Dialogs/EditIndustryDialog";
import { ViewIndustryDialog } from "../Dialogs/ViewIndustryDialog";
import type { IndustryListRef } from "../Industry";
import {
  type Industry,
  useGetIndustriesQueryFn,
} from "./hooks/useGetIndustries";
import { useIndustryColumns } from "./hooks/useIndustryColumns";

export type IndustryListProps = { search?: string | null };

export const IndustryList = forwardRef(
  (
    { search = null }: IndustryListProps,
    ref: ForwardedRef<IndustryListRef>
  ) => {
    const gridRef = useRef<AgGridReact<Industry>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentIndustry, setCurrentIndustry] = useState<Industry>();

    const [loading, setLoading] = useState(false);

    const { column } = useIndustryColumns({
      onAction: (actionType, industry) => {
        onDialogOpen(actionType);
        setCurrentIndustry(industry);
      },
      loading,
    });

    const { getIndustries } = useGetIndustriesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { industries, totalCount } = await getIndustries({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (industries.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (industries.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(industries, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<Industry>) => {
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
      refreshIndustryList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentIndustry && (
        <EditIndustryDialog
          open
          onClose={onDialogClose}
          industryId={currentIndustry.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentIndustry && (
        <DeleteIndustryDialog
          open
          industry={currentIndustry}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentIndustry && (
        <ViewIndustryDialog
          open
          onClose={onDialogClose}
          industryId={currentIndustry.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<Industry>>
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

IndustryList.displayName = "IndustryList";
