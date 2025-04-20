import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import { useQueryClient } from "@tanstack/react-query";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { salaryStructureKeys } from "../../../../../../../queryKeysFactories/SalaryStructure";
import type { AgDataWithActions } from "../../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../../utils/helper";
import { DeleteCustomSalaryStructureDialog } from "../../CustomBasedSalaryStructure/DeleteCustomSalaryStructure/Dialogs/DeleteCustomSalaryStructureDialog";
import { useCustomBasedSalaryStructureColumns } from "./CustomBasedSalaryStructureList/Hooks/useCustomBasedSalaryStructureColumns";
import type { CustomSalaryStructureType } from "./CustomBasedSalaryStructureList/Hooks/useGetCustomBasedSalaryStructureList";
import { useCustomBasedSalaryStructureFn } from "./CustomBasedSalaryStructureList/Hooks/useGetCustomBasedSalaryStructureList";

export type CustomBasedSalaryStructureListRefType = {
  refresh: () => void;
};

export const CustomBasedSalaryStructureList = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { onDialogClose, openedDialog, onDialogOpen } = useDialogActions();

  const gridRef = useRef<AgGridReact<CustomSalaryStructureType>>(null);

  const params = useParams();

  const searchParams = useSearchParams();

  const ssId = params.ssId as string;

  const interval = searchParams.get("interval") ?? "";

  const [customSalaryStructureData, setCustomSalaryStructureData] =
    useState<CustomSalaryStructureType>();

  const { columns } = useCustomBasedSalaryStructureColumns({
    loading,
    onAction: (actionType, rowData) => {
      if (actionType === "edit") {
        router.push(
          `/payroll/settings/salary-structure/salary-structure-details/${ssId}/edit/${rowData.id}/custom-based-salary-structure/?interval=${interval}&list=custom`
        );
      }

      if (actionType === "view") {
        router.push(
          `/payroll/settings/salary-structure/salary-structure-details/${ssId}/view/${rowData.id}/custom-based-salary-structure/?interval=${interval}&list=custom`
        );
      }

      if (actionType === "delete") {
        onDialogOpen(actionType);

        setCustomSalaryStructureData(rowData);
      }
    },
  });

  const { getCustomBasedSalaryStructureList } =
    useCustomBasedSalaryStructureFn();

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { customSalaryStructures, totalCount } =
      await getCustomBasedSalaryStructureList({
        body: {
          quickFilter: filterSearchParams(null),
          ...params,
        },
        interval,
        ssId,
      });

    let lastRow = -1;

    if (customSalaryStructures.length <= defaultPageSize) {
      lastRow = totalCount;
    }

    setLoading(false);

    if (customSalaryStructures.length === 0) {
      gridRef.current?.api.showNoRowsOverlay();
    } else {
      gridRef.current?.api.hideOverlay();
    }

    return params.successCallback(customSalaryStructures, lastRow);
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

  if (loading) {
    gridRef.current?.api.hideOverlay();
  }

  const queryClient = useQueryClient();

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("datasource", dataSource);
    }

    queryClient.invalidateQueries({
      queryKey: salaryStructureKeys.customList(ssId, interval),
    });
  }, [interval]);

  const dialogRenderer: DialogRenderer = {
    delete: customSalaryStructureData && (
      <DeleteCustomSalaryStructureDialog
        onClose={onDialogClose}
        onDeleteSuccess={refreshCache}
        open
        customSalaryStructureData={customSalaryStructureData}
        ssId={ssId}
      />
    ),
  };

  return (
    <>
      <AgGrid<AgDataWithActions<CustomSalaryStructureType>>
        ref={gridRef}
        columnDefs={columns}
        onGridReady={onGridReady}
        height="calc(95vh - 220px)"
        pagination
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

CustomBasedSalaryStructureList.displayName = "CustomBasedSalaryStructureList";
