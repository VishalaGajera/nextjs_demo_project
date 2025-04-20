import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
} from "react";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../../types/agGrid";
import { type DialogRenderer } from "../../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../../utils/helper";
import { DeleteIncomeTaxRegimeDialog } from "../Dialogs/DeleteIncomeTaxRegimeDialog";
import { EditIncomeTaxRegimeDialog } from "../Dialogs/EditIncomeTaxRegimeDialog";
import { ViewIncomeTaxRegimeDialog } from "../Dialogs/ViewIncomeTaxRegimeDialog";
import { type IncomeTaxRegimeListRef } from "../IncomeTaxRegime";
import {
  useListIncomeTaxRegimeQueryFn,
  type IncomeTaxRegimes,
} from "./hooks/useGeIncomeTaxRegimeList";
import { useIncomeTaxRegimeColumns } from "./hooks/useIncomeTaxRegimeColumns";

export type IncomeTaxRegimeListProps = { search?: string | null };

export const IncomeTaxRegimeList = forwardRef(
  (
    { search = null }: IncomeTaxRegimeListProps,
    ref: ForwardedRef<IncomeTaxRegimeListRef>
  ) => {
    const gridRef = useRef<AgGridReact<IncomeTaxRegimes>>(null);

    const [loading, setLoading] = useState(false);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentIncomeTaxRegime, setCurrentIncomeTaxRegime] =
      useState<IncomeTaxRegimes>();

    const { column } = useIncomeTaxRegimeColumns({
      onAction: (actionType, incomeTaxRegimes) => {
        onDialogOpen(actionType);
        setCurrentIncomeTaxRegime(incomeTaxRegimes);
      },
      loading,
    });

    const { getIncomeTaxRegime } = useListIncomeTaxRegimeQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { incomeTaxRegimes, totalCount } = await getIncomeTaxRegime({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (incomeTaxRegimes.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (incomeTaxRegimes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(incomeTaxRegimes, lastRow);
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => ({
      refreshIncomeTaxRegimeList: () => {
        refreshCache();
      },
    }));

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      delete: currentIncomeTaxRegime && (
        <DeleteIncomeTaxRegimeDialog
          open
          onClose={onDialogClose}
          onDeleteSuccess={() => refreshCache()}
          incomeTaxRegime={currentIncomeTaxRegime}
        />
      ),
      view: currentIncomeTaxRegime && (
        <ViewIncomeTaxRegimeDialog
          open
          onClose={onDialogClose}
          incomeTaxRegimeId={currentIncomeTaxRegime.id}
        />
      ),
      edit: currentIncomeTaxRegime && (
        <EditIncomeTaxRegimeDialog
          open
          onClose={onDialogClose}
          onEditSuccess={() => refreshCache()}
          incomeTaxRegimeId={currentIncomeTaxRegime.id}
        />
      ),
    };

    return (
      <>
        <AgGrid<AgDataWithActions<IncomeTaxRegimes>>
          ref={gridRef}
          columnDefs={column}
          onGridReady={onGridReady}
          height="calc(95vh - 215px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

IncomeTaxRegimeList.displayName = "IncomeTaxRegimeList";
