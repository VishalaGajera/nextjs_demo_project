import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
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
import { DeleteSalaryStructureDialog } from "../DeleteSalaryStructure/Dialogs/DeleteSalaryStructureDialog";
import { EditSalaryStructureDialog } from "../EditSalaryStructure/Dialogs/EditSalaryStructureDialog";
import { ViewSalaryStructureDialog } from "../ViewSalaryStructure/Dialogs/ViewSalaryStructureDialog";
import {
  type SalaryStructure,
  useSalaryStructureQueryFn,
} from "./Hooks/useGetSalaryStructureList";
import { useSalaryStructureColumns } from "./Hooks/useSalaryStructureColumns";

type SalaryStructureListProps = {
  search: string | null;
};

export type SalaryStructureListRefType = {
  refreshCache: () => void;
};

export const SalaryStructureList = forwardRef(
  (
    { search = null }: SalaryStructureListProps,
    ref: ForwardedRef<SalaryStructureListRefType>
  ) => {
    const gridRef = useRef<AgGridReact<SalaryStructure>>(null);

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [salaryStructureData, setSalaryStructureData] =
      useState<SalaryStructure>();

    const { onDialogClose, openedDialog, onDialogOpen } = useDialogActions();

    const { columns } = useSalaryStructureColumns({
      handleClickOnEmployee(ssId) {
        router.push(
          `/payroll/settings/salary-structure/salary-structure-details/${ssId}`
        );
      },
      loading,
      onAction: (actionType, rowData) => {
        onDialogOpen(actionType);
        setSalaryStructureData(rowData);
      },
    });

    const { getSalaryStructureList } = useSalaryStructureQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { salaryStructures, totalCount } = await getSalaryStructureList({
        body: {
          quickFilter: filterSearchParams(search),
          ...params,
        },
      });

      let lastRow = -1;

      if (salaryStructures.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (salaryStructures.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(salaryStructures, lastRow);
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

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => {
      return {
        refreshCache() {
          refreshCache();
        },
      };
    });

    const dialogRenderer: DialogRenderer = {
      edit: salaryStructureData && (
        <EditSalaryStructureDialog
          onEditSuccess={refreshCache}
          open
          ssId={salaryStructureData.id}
          onClose={onDialogClose}
        />
      ),

      view: salaryStructureData && (
        <ViewSalaryStructureDialog
          open
          ssId={salaryStructureData.id}
          onClose={onDialogClose}
        />
      ),
      delete: salaryStructureData && (
        <DeleteSalaryStructureDialog
          onClose={onDialogClose}
          onDeleteSuccess={refreshCache}
          open
          salaryStructure={salaryStructureData}
        />
      ),
    };

    return (
      <>
        <AgGrid<AgDataWithActions<SalaryStructure>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 150px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

SalaryStructureList.displayName = "SalaryStructureList";
