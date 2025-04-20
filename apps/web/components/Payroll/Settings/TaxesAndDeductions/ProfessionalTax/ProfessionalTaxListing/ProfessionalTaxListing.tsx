import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import { QueryClient } from "@tanstack/react-query";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import { professionalTaxesKeys } from "../../../../../../queryKeysFactories/professionalTaxes";
import type { AgDataWithActions } from "../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../utils/helper";
import { DeleteProfessionalTaxDialog } from "./Dialogs/DeleteProfessionalTaxDialog";
import {
  type PtGroupType,
  useGetProfessionalTaxListQueryFn,
} from "./Hooks/useGetProfessionalTaxList";
import { useProfessionalTaxesColumns } from "./Hooks/useProfessionalTaxesListColumns";

export type ProfessionalTaxesListProps = { search?: string | null };

export const ProfessionalTaxesList = ({
  search = null,
}: ProfessionalTaxesListProps) => {
  const gridRef = useRef<AgGridReact<PtGroupType>>(null);

  const [loading, setLoading] = useState(false);

  const [ptGroup, setPtGroup] = useState<PtGroupType>();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const router = useRouter();

  const { column } = useProfessionalTaxesColumns({
    loading,
    onAction(actionType, rowData) {
      if (actionType === "delete") {
        setPtGroup(rowData);
        onDialogOpen("delete");

        return;
      }
      router.push(
        `/payroll/settings/taxes-deductions/professional-tax/${actionType}/${rowData.id}`
      );
    },
  });

  const { getProfessionalTaxList } = useGetProfessionalTaxListQueryFn();

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { ptGroups, totalCount } = await getProfessionalTaxList({
      body: {
        ...params,
        quickFilter: filterSearchParams(search),
      },
    });

    let lastRow = -1;

    if (ptGroups.length <= defaultPageSize) {
      lastRow = totalCount;
    }

    setLoading(false);

    if (ptGroups.length === 0) {
      gridRef.current?.api.showNoRowsOverlay();
    } else {
      gridRef.current?.api.hideOverlay();
    }

    return params.successCallback(ptGroups, lastRow);
  };

  const dataSource: IDatasource = {
    getRows: (params) => {
      getRows(params);
    },
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption("datasource", dataSource);
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("datasource", dataSource);
    }
  }, [search]);

  if (loading) {
    gridRef.current?.api.hideOverlay();
  }

  const refreshCache = () => {
    gridRef.current?.api.refreshInfiniteCache();
  };

  const queryClient = new QueryClient();

  const dialogRenderer: DialogRenderer = {
    delete: ptGroup && (
      <DeleteProfessionalTaxDialog
        onClose={onDialogClose}
        onDeleteSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: professionalTaxesKeys.listing(),
          });

          refreshCache();
        }}
        open
        PtGroup={ptGroup}
      />
    ),
  };

  return (
    <>
      <AgGrid<AgDataWithActions<PtGroupType>>
        ref={gridRef}
        columnDefs={column}
        onGridReady={onGridReady}
        height="calc(95vh - 220px)"
        pagination
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
