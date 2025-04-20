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
import type { FieldValues } from "react-hook-form";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import type { AdvanceAndReceiveListRef } from "../AdvanceAndReceive";
import { DeleteAdvanceAndReceiveDialog } from "../Dialogs/DeleteAdvanceAndReceiveDialog";
import { EditAdvanceAndReceiveDialog } from "../Dialogs/EditAdvanceAndReceiveDialog";
import { ViewAdvanceAndReceiveDialog } from "../Dialogs/ViewAdvanceAndReceiveDialog";
import { useAdvanceAndReceiveListColumns } from "./hooks/useAdvanceAndReceiveListColumns";
import {
  type AdvanceAndReceive,
  useGetAdvanceAndReceiveQueryFn,
} from "./hooks/useGetAdvanceAndReceiveList";

export type AdvanceAndReceiveListProps = {
  search: string | null;
  externalFilter?: FieldValues;
};

export const AdvanceAndReceiveList = forwardRef(
  (
    { search = null, externalFilter }: AdvanceAndReceiveListProps,
    ref: ForwardedRef<AdvanceAndReceiveListRef>
  ) => {
    const gridRef = useRef<AgGridReact<AdvanceAndReceive>>(null);

    const { openedDialog, onDialogOpen, onDialogClose } = useDialogActions();

    const [currentAdvanceAndReceive, setCurrentAdvanceAndReceive] =
      useState<AdvanceAndReceive>();

    const [loading, setLoading] = useState(false);

    const { columns } = useAdvanceAndReceiveListColumns({
      onAction: (actionType, advanceAndReceive) => {
        onDialogOpen(actionType);

        setCurrentAdvanceAndReceive(advanceAndReceive);
      },
      loading,
    });

    const { getAdvanceAndReceive } = useGetAdvanceAndReceiveQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { advanceAndReceive, totalCount } = await getAdvanceAndReceive({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (advanceAndReceive.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (advanceAndReceive.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(advanceAndReceive, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const dialogRenderer: DialogRenderer = {
      edit: currentAdvanceAndReceive && (
        <EditAdvanceAndReceiveDialog
          open
          onClose={onDialogClose}
          advanceAndReceiveId={currentAdvanceAndReceive.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentAdvanceAndReceive && (
        <DeleteAdvanceAndReceiveDialog
          open
          advanceAndReceive={currentAdvanceAndReceive}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentAdvanceAndReceive && (
        <ViewAdvanceAndReceiveDialog
          open
          onClose={onDialogClose}
          advanceAndReceiveId={currentAdvanceAndReceive.id}
        />
      ),
    };

    const onGridReady = useCallback(
      (params: GridReadyEvent<AdvanceAndReceive>) => {
        params.api.setGridOption("datasource", dataSource);
      },
      []
    );

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search, externalFilter]);

    useImperativeHandle(ref, () => ({
      refreshAdvanceAndReceiveList() {
        refreshCache();
      },
    }));

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<AdvanceAndReceive>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 212px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

AdvanceAndReceiveList.displayName = "AdvanceAndReceiveList";
