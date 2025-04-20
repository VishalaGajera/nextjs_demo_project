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
import { type DialogRenderer } from "../../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../../utils/helper";
import { DeleteGratuityDialog } from "./Dialogs/DeleteGratuityDialog";
import { EditGratuityDialog } from "./Dialogs/EditGratuityDialog";
import type { GratuityInfo } from "./Dialogs/Hooks/getGratuityById";
import { ViewGratuityDialog } from "./Dialogs/ViewGratuityDialog";
import { useGratuityQueryFn } from "./hooks/useGetGratuityList";
import { useGratuityColumns } from "./hooks/useGratuityColumns";

type GratuityListProps = {
  search: string | null;
};

export type GratuityListRefType = {
  refresh: () => void;
};

export const GratuityList = forwardRef(
  (
    { search = null }: GratuityListProps,
    ref: ForwardedRef<GratuityListRefType>
  ) => {
    const gridRef = useRef<AgGridReact<GratuityInfo>>(null);

    const [loading, setLoading] = useState(false);

    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const [gratuity, setGratuity] = useState<GratuityInfo>();

    const { columns } = useGratuityColumns({
      loading,
      onAction: (actionsType, gratuity) => {
        onDialogOpen(actionsType);
        setGratuity(gratuity);
      },
    });

    const { getGratuityList } = useGratuityQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { gratuityGroups, totalCount } = await getGratuityList({
        body: {
          quickFilter: filterSearchParams(search),
          ...params,
        },
      });

      let lastRow = -1;

      if (gratuityGroups.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (gratuityGroups.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(gratuityGroups, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => {
      return {
        refresh() {
          refreshCache();
        },
      };
    });

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    const dialogRenderer: DialogRenderer = {
      edit: gratuity && (
        <EditGratuityDialog
          gratuityId={gratuity.id}
          onClose={onDialogClose}
          onEditSuccess={refreshCache}
          open
        />
      ),
      view: gratuity && (
        <ViewGratuityDialog
          gratuityId={gratuity.id}
          onClose={onDialogClose}
          open
        />
      ),
      delete: gratuity && (
        <DeleteGratuityDialog
          open
          gratuity={gratuity}
          onClose={onDialogClose}
          onDeleteSuccess={refreshCache}
        />
      ),
    };

    return (
      <>
        <AgGrid<AgDataWithActions<GratuityInfo>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 220px)"
          pagination
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

GratuityList.displayName = "GratuityList";
