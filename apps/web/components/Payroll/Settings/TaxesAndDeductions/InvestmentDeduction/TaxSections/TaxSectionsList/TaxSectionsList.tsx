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
import { DeleteTaxSectionsDialog } from "../Dialogs/DeleteTaxSectionsDialog";
import { EditTaxSectionsDialog } from "../Dialogs/EditTaxSectionsDialog";
import { ViewTaxSectionsDialog } from "../Dialogs/ViewTaxSectionsDialog";
import type { TaxSectionsListRef } from "../TaxSections";
import type { TaxSectionsRecord } from "./hooks/useGetTaxSectionsList";
import { useGetTaxSectionsListQueryFn } from "./hooks/useGetTaxSectionsList";
import { useTaxSectionsColumns } from "./hooks/useTaxSectionsListColumns";

export type TaxSectionsListProps = { search?: string | null };

export const TaxSectionsList = forwardRef(
  (
    { search = null }: TaxSectionsListProps,
    ref: ForwardedRef<TaxSectionsListRef>
  ) => {
    const gridRef = useRef<AgGridReact<TaxSectionsRecord>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentTaxSection, setCurrentTaxSection] =
      useState<TaxSectionsRecord>();

    const [loading, setLoading] = useState(false);

    const { columns } = useTaxSectionsColumns({
      onAction: (actionType, taxSection) => {
        onDialogOpen(actionType);
        setCurrentTaxSection(taxSection);
      },
      loading,
    });

    const { getTaxSectionsList } = useGetTaxSectionsListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { taxSections, totalCount } = await getTaxSectionsList({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (taxSections.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (taxSections.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(taxSections, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback(
      (params: GridReadyEvent<TaxSectionsRecord>) => {
        params.api.setGridOption("datasource", dataSource);
      },
      []
    );

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const dialogRenderer: DialogRenderer = {
      edit: currentTaxSection && (
        <EditTaxSectionsDialog
          open
          onClose={onDialogClose}
          taxSectionsId={currentTaxSection.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentTaxSection && (
        <ViewTaxSectionsDialog
          open
          onClose={onDialogClose}
          taxSectionsId={currentTaxSection.id}
        />
      ),
      delete: currentTaxSection && (
        <DeleteTaxSectionsDialog
          open
          onClose={onDialogClose}
          taxSectionsData={currentTaxSection}
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
      refreshTaxSectionsList() {
        refreshCache();
      },
    }));

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<TaxSectionsRecord>>
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

TaxSectionsList.displayName = "TaxSectionsList";
