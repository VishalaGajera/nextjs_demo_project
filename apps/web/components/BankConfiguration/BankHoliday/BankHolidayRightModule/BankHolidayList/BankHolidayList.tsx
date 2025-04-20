import { AgGrid, Button, defaultPageSize } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Stack } from "@mui/material";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { AddBankHolidayDialog } from "./Dialog/AddBankHolidayDialog";
import { DeleteBankHolidayDialog } from "./Dialog/DeleteBankHolidayDialog";
import { EditBankHolidayDialog } from "./Dialog/EditBankHolidayDialog";
import { ViewBankHolidayDialog } from "./Dialog/ViewBankHolidayDialog";
import {
  type BankHolidayType,
  useGetBankHolidayGroupListColumns,
} from "./hooks/useGetBankHolidayGroupListColumns";
import { useGetBankHolidaysQueryFn } from "./hooks/useGetBankHolidays";

type BankHolidayListProps = {
  bankHolidayYears: { year: string }[];
};

export const BankHolidayList = ({ bankHolidayYears }: BankHolidayListProps) => {
  const searchParams = useSearchParams();

  const companyId = searchParams.get("tab") ?? "";

  const year = searchParams.get("year") ?? "";

  const gridRef = useRef<AgGridReact<BankHolidayType>>(null);

  const router = useRouter();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [loading, setLoading] = useState(false);

  const [currentBankHoliday, setCurrentBankHoliday] =
    useState<BankHolidayType>();

  const { column } = useGetBankHolidayGroupListColumns({
    onAction: (actionType, bankHoliday) => {
      onDialogOpen(actionType);
      setCurrentBankHoliday(bankHoliday);
    },
    loading,
  });

  const { getBankHolidays } = useGetBankHolidaysQueryFn();

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { holidays, totalCount } = await getBankHolidays({
      companyId,
      year,
    });

    let lastRow = -1;

    if (holidays) {
      if (holidays.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (holidays.length === 0) {
        if (bankHolidayYears[0]) {
          router.push(
            `/bank-configurations/bank-holiday?tab=${companyId}&year=${bankHolidayYears[0].year}`
          );
        }

        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      params.successCallback(holidays, lastRow);
    }
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
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("datasource", dataSource);
    }
  }, [year, companyId]);

  const dialogRenderer: DialogRenderer = {
    edit: currentBankHoliday?.id && (
      <EditBankHolidayDialog
        open
        onClose={onDialogClose}
        companyId={companyId}
        bankHolidayId={currentBankHoliday.id}
        onEditSuccess={refreshCache}
        year={year}
      />
    ),
    add: (
      <AddBankHolidayDialog
        open
        onClose={onDialogClose}
        companyId={companyId}
        onAddSuccess={refreshCache}
        year={year}
      />
    ),
    delete: currentBankHoliday?.id && (
      <DeleteBankHolidayDialog
        open
        onClose={onDialogClose}
        companyId={companyId}
        bankHolidayId={currentBankHoliday.id}
        onDeleteSuccess={refreshCache}
        bankHolidayName={currentBankHoliday.holiday_name}
      />
    ),
    view: currentBankHoliday?.id && (
      <ViewBankHolidayDialog
        open
        onClose={onDialogClose}
        companyId={companyId}
        bankHolidayId={currentBankHoliday.id}
        year={year}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <Button
        variant="outlined"
        startIcon={<Add />}
        sx={{ marginLeft: "auto", marginRight: "10px" }}
        onClick={() => onDialogOpen("add")}
        disabled={!bankHolidayYears.length}
      >
        Add Bank Holiday
      </Button>

      <AgGrid<AgDataWithActions<BankHolidayType>>
        ref={gridRef}
        columnDefs={column}
        onGridReady={onGridReady}
        height="calc(95vh - 225px)"
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
