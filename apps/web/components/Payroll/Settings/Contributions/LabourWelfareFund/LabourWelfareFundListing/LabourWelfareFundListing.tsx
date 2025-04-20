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
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../utils/helper";
import { DeleteLabourWelfareFundDialog } from "../Dialogs/DeleteLabourWelfareFundDialog";
import { EditLabourWelfareFundDialog } from "../Dialogs/EditLabourWelfareFundDialog";
import { ViewLabourWelfareFundDialog } from "../Dialogs/ViewLabourWelfareFundDialog";
import type { LabourWelfareFundListRef } from "../LabourWelfareFundBody";
import { useLabourWelfareFundColumns } from "./hooks/useLabourWelfareFundColumns";
import {
  useGetLabourWelfareFundQueryFn,
  type LabourWelfareFund,
} from "./hooks/useListLabourWelfareFund";

export type LabourWelfareFundListProps = { search?: string | null };

export const LabourWelfareFundListing = forwardRef(
  (
    { search = null }: LabourWelfareFundListProps,
    ref: ForwardedRef<LabourWelfareFundListRef>
  ) => {
    const gridRef = useRef<AgGridReact<LabourWelfareFund>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentLabourWelfareFund, setCurrentLabourWelfareFund] =
      useState<LabourWelfareFund>();

    const [loading, setLoading] = useState(false);

    const { column } = useLabourWelfareFundColumns({
      onAction: (actionType, labourWelfareFund) => {
        onDialogOpen(actionType);
        setCurrentLabourWelfareFund(labourWelfareFund);
      },
      loading,
    });

    const { getLabourWelfareFund } = useGetLabourWelfareFundQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { lwfGroups, totalCount } = await getLabourWelfareFund({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (lwfGroups.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (lwfGroups.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(lwfGroups, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    useImperativeHandle(ref, () => ({
      refreshLWFList: () => {
        gridRef.current?.api.refreshInfiniteCache();
      },
    }));

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

    const dialogRenderer: DialogRenderer = {
      delete: currentLabourWelfareFund && (
        <DeleteLabourWelfareFundDialog
          open
          labourWelfareFund={currentLabourWelfareFund}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      edit: currentLabourWelfareFund && (
        <EditLabourWelfareFundDialog
          open
          onClose={onDialogClose}
          lwfGroupId={currentLabourWelfareFund.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentLabourWelfareFund && (
        <ViewLabourWelfareFundDialog
          open
          onClose={onDialogClose}
          lwfGroupId={currentLabourWelfareFund.id}
        />
      ),
    };

    return (
      <>
        <AgGrid<AgDataWithActions<LabourWelfareFund>>
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
LabourWelfareFundListing.displayName = "LabourWelfareFundListing";
