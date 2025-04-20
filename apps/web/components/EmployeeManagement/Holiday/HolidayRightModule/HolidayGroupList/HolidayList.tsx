import { AgGrid, Button, defaultPageSize } from "@codezee/sixtify-brahma";
import { Add, IosShare } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Stack, useTheme } from "@mui/material";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { useAgGridPdfExport } from "../../../../../hooks/useAgGridPdfExport";
import { useExcelExport } from "../../../../../hooks/useExcelExport";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { AddHolidayDialog } from "./Dialog/AddHolidayDialog";
import { DeleteHolidayDialog } from "./Dialog/DeleteHolidayDialog";
import { EditHolidayDialog } from "./Dialog/EditHolidayDialog";
import { ViewHolidayDialog } from "./Dialog/ViewHolidayDialog";
import {
  useGetHolidayGroupListColumns,
  type HolidayType,
} from "./hooks/useGetHolidayGroupListColumns";
import { useGetHolidaysQueryFn } from "./hooks/useGetHolidays";

type HolidayListProps = {
  holidayGroupId: string;
  year: string;
  holidayYears: { year: string }[];
};

export const HolidayList = ({
  holidayGroupId,
  year,
  holidayYears,
}: HolidayListProps) => {
  const gridRef = useRef<AgGridReact<HolidayType>>(null);

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const router = useRouter();

  const [currentHoliday, setCurrentHoliday] = useState<HolidayType>();

  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const { exportToExcel } = useExcelExport();

  const { exportToPDF } = useAgGridPdfExport();

  const handleMenuOpen = ({ currentTarget }: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const { column } = useGetHolidayGroupListColumns({
    onAction: (actionType, holiday) => {
      onDialogOpen(actionType);
      setCurrentHoliday(holiday);
    },
    loading,
  });

  const holidayColumnsToRemove = ["id", "holiday_group_id", "year", "action"];

  const handleExportToXLS = () => {
    if (!gridRef.current) {
      return;
    }

    const gridApi = gridRef.current.api;

    const columns = gridApi.getColumns()?.map((col) => col.getColDef()) ?? [];

    const excelColumns = columns
      .filter(({ field }) => field && !holidayColumnsToRemove.includes(field))
      .map(({ field, headerName }) => ({
        header: headerName ?? "",
        key: field ?? "",
        width: 25,
      }));

    exportToExcel({
      gridApi,
      fileName: "Holiday List",
      sheetName: "Holiday",
      columns: excelColumns,
      dateKeys: ["holiday_date"],
      includeDay: true,
    });

    handleMenuClose();
  };

  const handleExportToPDF = () => {
    if (gridRef.current) {
      exportToPDF(gridRef.current.api, {
        fileName: "Holiday List",
        dateKeys: ["holiday_date"],
        columnsToRemove: ["action"],
        includeDay: true,
      });
    }

    handleMenuClose();
  };

  const { getHolidays } = useGetHolidaysQueryFn();

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { startRow, endRow, sortModel, filterModel } = params;

    const { holidays, totalCount } = await getHolidays({
      holidayGroupId,
      body: {
        startRow,
        endRow,
        sortModel,
        filterModel: {
          ...filterModel,
          holiday_group_id: {
            filterType: "text",
            type: "equals",
            filter: holidayGroupId,
          },
          year: {
            filterType: "number",
            type: "equals",
            filter: Number(year),
          },
        },
      },
    });

    let lastRow = -1;

    if (holidays) {
      if (holidays.length <= defaultPageSize) {
        lastRow = totalCount;
      }
      setLoading(false);

      if (holidays.length === 0) {
        if (holidayYears[0]) {
          router.push(
            `/employee-management/holiday?tab=${holidayGroupId}&year=${holidayYears[0].year}`
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
  }, [year, holidayGroupId]);

  const dialogRenderer: DialogRenderer = {
    edit: currentHoliday?.id && (
      <EditHolidayDialog
        open
        onClose={onDialogClose}
        holidayGroupId={holidayGroupId}
        holidayId={currentHoliday.id}
        onEditSuccess={refreshCache}
        year={year}
      />
    ),
    delete: currentHoliday?.id && (
      <DeleteHolidayDialog
        open
        onClose={onDialogClose}
        holidayGroupId={holidayGroupId}
        holidayId={currentHoliday.id}
        onDeleteSuccess={refreshCache}
        holidayName={currentHoliday.holiday_name}
      />
    ),
    add: (
      <AddHolidayDialog
        open
        onClose={onDialogClose}
        holidayGroupId={holidayGroupId}
        onAddSuccess={refreshCache}
        year={year}
      />
    ),
    view: currentHoliday?.id && (
      <ViewHolidayDialog
        open
        onClose={onDialogClose}
        holidayGroupId={holidayGroupId}
        holidayId={currentHoliday.id}
        year={year}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <Stack direction="row" gap="5px" marginLeft="auto">
        <IconButton
          onClick={handleMenuOpen}
          disabled={loading}
          sx={{
            height: "38px",
            width: "36px",
            border: `0.5px solid ${iron[800]}`,
          }}
        >
          <IosShare fontSize="small" sx={{ fill: `${iron[400]}` }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={handleExportToXLS}>XLS</MenuItem>

          <MenuItem onClick={handleExportToPDF}>PDF</MenuItem>
        </Menu>

        <Button
          variant="outlined"
          startIcon={<Add />}
          sx={{ marginLeft: "auto", marginRight: "10px" }}
          onClick={() => onDialogOpen("add")}
        >
          Add Holiday
        </Button>
      </Stack>

      <AgGrid<AgDataWithActions<HolidayType>>
        ref={gridRef}
        columnDefs={column}
        onGridReady={onGridReady}
        height="calc(95vh - 220px)"
        pagination
      />
      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
