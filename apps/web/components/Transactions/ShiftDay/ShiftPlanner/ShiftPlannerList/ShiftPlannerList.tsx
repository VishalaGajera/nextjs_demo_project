"use client";

import {
  defaultPageSize,
  FacebookCircularProgress,
  getStatusLabel,
  PadBox,
  Tooltip,
} from "@codezee/sixtify-brahma";
import {
  Avatar,
  Box,
  Pagination,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type {
  ActionEventArgs,
  CellSelectEventArgs,
  CellSelectingEventArgs,
  QueryCellInfoEventArgs,
} from "@syncfusion/ej2-react-grids";
import {
  ColumnDirective,
  ColumnsDirective,
  Filter,
  GridComponent,
  Inject,
  Page,
  Selection,
  Sort,
} from "@syncfusion/ej2-react-grids";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { DateTime } from "luxon";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { FieldValues } from "react-hook-form";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import { shiftPlannerKeys } from "../../../../../queryKeysFactories/shiftPlanner";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { getShiftTime } from "../../../../../utils/date";
import { filterSearchParams } from "../../../../../utils/helper";
import { ShiftPlannerDialog } from "../Dialog/ShiftPlannerDialog";
import type { ShiftPlanner } from "./hooks/useGetShiftPlanners";
import type { shiftPlannerPayloadType } from "./hooks/useGetShiftPlannersv2";
import { useGetShiftPlanner } from "./hooks/useGetShiftPlannersv2";

export type ShiftPlannerListProps = {
  search?: string | null;
  datePeriod: string;
  externalFilter?: FieldValues;
};

type SelectedCell = {
  rowIndex: number;
  cellIndexes: number[];
};

export type ShiftPlannerEditFields = {
  employee_ids: string[];
  effective_from: string;
  effective_to: string;
};

export const ShiftPlannerList = ({
  search = null,
  datePeriod,
  externalFilter,
}: ShiftPlannerListProps) => {
  const theme = useTheme();

  const { darkOrange, iron, lightSlateBlue, butterflyBlue, slate } =
    theme.palette.app.color;

  const gridRef = useRef<GridComponent>(null);

  const [body, setBody] = useState<shiftPlannerPayloadType>({
    startRow: 0,
    endRow: defaultPageSize,
    sortModel: [],
    quickFilter: filterSearchParams(search),
    externalFilter,
  });

  const [pageSetting, setPageSetting] = useState({
    currentPage: 1,
    totalRecords: 0,
  });

  const [allowKeyboard, setAllowKeyboard] = useState(false);

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [shiftPlannerData, setShiftPlannerData] =
    useState<ShiftPlannerEditFields>({
      employee_ids: [],
      effective_from: "",
      effective_to: "",
    });

  const monthDays = useMemo(() => {
    const date = DateTime.fromISO(datePeriod);

    return Array.from({ length: date.daysInMonth ?? 0 }, (_, i) => {
      const currentDate = DateTime.local(date.year, date.month, i + 1);

      return { day: i + 1, weekday: currentDate.toFormat("ccc") };
    });
  }, [datePeriod]);

  const getDayTypeStyles = useCallback(
    (dayType: string) => {
      switch (dayType) {
        case "weekly_off":
          return { backgroundColor: darkOrange[600] };

        case "first_half_weekly_off":
          return {
            backgroundImage: `linear-gradient(to top, ${iron[600]} 50%, ${darkOrange[600]} 50%)`,
          };

        case "second_half_weekly_off":
          return {
            backgroundImage: `linear-gradient(to bottom, ${iron[600]} 50%, ${darkOrange[600]} 50%)`,
          };

        case "holiday":
          return { backgroundColor: lightSlateBlue[600] };

        default:
          return {};
      }
    },
    [theme]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Control") {
        event.preventDefault();
        setAllowKeyboard(true);
      }
    },
    []
  );

  const onKeyUp = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Control") {
      setAllowKeyboard(false);
    }
  }, []);

  const onQueryCellInfo = useCallback(
    (args: QueryCellInfoEventArgs) => {
      const { field } = args.column ?? {};

      if (field?.startsWith("days.")) {
        const data = args.data as ShiftPlanner;

        const dayIndex = parseInt(field.split(".")[1] ?? "", 10);

        const dayType = data.days[dayIndex]?.dayType ?? "working";

        const styles = getDayTypeStyles(dayType);

        if (styles && args.cell) {
          const cell = args.cell as HTMLTableCellElement;

          Object.assign(cell.style, styles);
        }
      }
    },
    [getDayTypeStyles]
  );

  const dayColumns = useMemo(() => {
    return monthDays.map(({ day, weekday }) => ({
      field: `days.${day}.label`,
      headerText: (
        <>
          Day {day}
          <br />({weekday})
        </>
      ),
      // eslint-disable-next-line sonarjs/no-unstable-nested-components
      template: ({ days }: ShiftPlanner) => {
        let dayType: string = getStatusLabel(days[day]?.dayType ?? "working");

        const tooltip =
          dayType === "Holiday"
            ? days[day]?.shift_type_name
            : days[day]?.tooltip;

        dayType =
          dayType === "Holiday" ? `Holiday ( ${days[day]?.tooltip} )` : dayType;

        return (
          <Typography
            sx={{
              width: "100%",
              textAlign: "center",
              color: `${days[day]?.is_assigned_via_shift_planner ? butterflyBlue[900] : ""}`,
            }}
          >
            <Tooltip
              toolTipLabel={
                <span>
                  {dayType}
                  <br />
                  {tooltip}
                  {` (${getShiftTime(days[day]?.shift_start, days[day]?.shift_end)})`}
                </span>
              }
            >
              {days[day]?.label ?? "-"}
            </Tooltip>
          </Typography>
        );
      },
      width: "100",
    }));
  }, [monthDays, theme]);

  const { data: employees, isFetching } = useGetShiftPlanner({
    body,
    datePeriod,
    company_id: externalFilter?.company_id,
  });

  useMemo(() => {
    if (employees.totalCount) {
      setPageSetting((prev) => ({
        ...prev,
        totalRecords: _.floor(employees.totalCount / defaultPageSize),
      }));
    }
  }, [employees.totalCount]);

  const onActionBegin = useCallback((args: ActionEventArgs) => {
    if (args.requestType === "sorting") {
      const direction = args.direction === "Ascending" ? "asc" : "desc";

      setBody((prev) => ({
        ...prev,
        sortModel: args.columnName
          ? [{ sort: direction, colId: args.columnName }]
          : [],
      }));
    }
  }, []);

  const onPageChange = (currentPage: number) => {
    setPageSetting((prev) => ({ ...prev, currentPage }));

    const startRow = (currentPage - 1) * defaultPageSize;

    const endRow = currentPage * defaultPageSize;

    setBody((prev) => ({ ...prev, startRow, endRow }));
  };

  const onCellSelected = (
    args: CellSelectEventArgs & { selectedRowCellIndex: SelectedCell[] }
  ) => {
    setAllowKeyboard(true);

    const currentViewRecords = gridRef?.current?.getCurrentViewRecords();

    const ids = args.selectedRowCellIndex.map((record) => {
      const rowData = currentViewRecords?.[record.rowIndex] as ShiftPlanner;

      return rowData?.id;
    });

    const selectionRange = args.selectedRowCellIndex[0]?.cellIndexes;

    const startIndex = selectionRange?.[0] ?? 1;

    let effective_to = "";

    if (selectionRange && selectionRange?.length >= 1) {
      const endIndex = selectionRange[selectionRange.length - 1] ?? 1;

      effective_to = `${datePeriod}-${String(endIndex).padStart(2, "0")}`;
    }

    const effective_from = `${datePeriod}-${String(startIndex).padStart(2, "0")}`;

    setShiftPlannerData((prev) => ({
      ...prev,
      employee_ids: ids ?? [],
      effective_from,
      effective_to,
    }));
  };

  const onCellSelecting = useCallback((args: CellSelectingEventArgs) => {
    // eslint-disable-next-line sonarjs/deprecation
    const clickedInsidePinnedColumn = (event?.target as HTMLElement).closest(
      ".e-leftfreeze"
    );

    if (clickedInsidePinnedColumn) {
      setTimeout(() => {
        gridRef.current?.clearCellSelection();
      });
    }

    if (args.isCtrlPressed || args.cellIndex?.cellIndex === 0) {
      args.cancel = true;
    }
  }, []);

  const handleContextMenu = (event: React.MouseEvent) => {
    const clickedInsideSelectedCell = (event.target as HTMLElement)?.closest(
      ".e-cellselectionbackground"
    );

    if (event.button === 0 && !clickedInsideSelectedCell) {
      gridRef.current?.clearCellSelection();
    }

    if (clickedInsideSelectedCell && shiftPlannerData.employee_ids.length > 0) {
      event.preventDefault();
      onDialogOpen("edit");
    }
  };

  const deselectAllCells = (event: React.MouseEvent) => {
    const clickedInsideSelectedCell = (event.target as HTMLElement)?.closest(
      ".e-cellselectionbackground"
    );

    const clickedInsidePinnedColumn = (event.target as HTMLElement).closest(
      ".e-leftfreeze"
    );

    if (clickedInsidePinnedColumn) {
      gridRef.current?.clearCellSelection();
    }

    if (event.button === 0 && !clickedInsideSelectedCell) {
      gridRef.current?.clearCellSelection();
    }
  };

  const queryClient = useQueryClient();

  const currentDate = DateTime.now().toISODate();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <ShiftPlannerDialog
        open
        onClose={onDialogClose}
        companyId={externalFilter?.company_id}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: shiftPlannerKeys.listing(datePeriod, body),
          });
          setShiftPlannerData({
            employee_ids: [],
            effective_from: "",
            effective_to: "",
          });
        }}
        currentDate={currentDate}
        shiftPlannerData={shiftPlannerData}
      />
    ),
  };

  const employeeColumnTemplate = (data: ShiftPlanner) => {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flex="1"
      >
        <Stack direction="row" gap="10px" alignItems="center">
          <Avatar src={data.avatar} alt="Employee Photo" />

          <Box>
            <Typography
              sx={{
                width: "100%",
              }}
            >
              {data.employee_name ?? "-"}
            </Typography>

            <Typography variant="body2" color={butterflyBlue[400]}>
              {data.employee_code ?? "-"}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    );
  };

  const headerTemplate = (title: ReactNode) => {
    return (
      <Typography
        variant="body1"
        sx={{
          fontSize: "14px",
          fontWeight: 700,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {title ?? "-"}
      </Typography>
    );
  };

  useMemo(() => {
    setBody((prev) => ({
      ...prev,
      quickFilter: filterSearchParams(search),
      externalFilter,
    }));
  }, [search, externalFilter]);

  return (
    <Stack
      onContextMenu={handleContextMenu}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      gap="10px"
      alignItems="center"
    >
      {!externalFilter?.company_id && (
        <PadBox padding={{ padding: "10px" }}>
          <Box
            sx={{
              backgroundColor: slate[700],
              borderRadius: "5px",
              textAlign: "center",
              paddingY: "10px",
            }}
          >
            To view and take action on the data, please select at least one
            company from the filters on the right and click Apply.
          </Box>
        </PadBox>
      )}
      {externalFilter?.company_id && (
        <>
          <Box
            sx={{
              height: "inherit",
              boxSizing: "border-box",
              width: "100%",
              position: "relative",
            }}
          >
            <GridComponent
              onClick={deselectAllCells}
              ref={gridRef}
              dataSource={employees.employees}
              allowSorting
              filterSettings={{ type: "Menu" }}
              allowFiltering
              frozenColumns={1}
              allowKeyboard={!allowKeyboard}
              queryCellInfo={onQueryCellInfo}
              cellSelecting={onCellSelecting}
              actionBegin={onActionBegin}
              cellSelected={onCellSelected}
              pageSettings={{
                totalRecordsCount: pageSetting.totalRecords,
                currentPage: pageSetting.currentPage,
              }}
              selectionSettings={{
                type: "Multiple",
                mode: "Cell",
                cellSelectionMode: "Box",
                enableToggle: false,
              }}
              height="calc(85vh - 220px)"
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="employee_name"
                  headerTemplate={() => headerTemplate("Employee")}
                  width="300"
                  template={employeeColumnTemplate}
                />
                {dayColumns.map((col) => (
                  <ColumnDirective
                    key={col.field}
                    {...col}
                    allowSorting={false}
                    allowFiltering={false}
                    headerTemplate={() => headerTemplate(col.headerText)}
                  />
                ))}
              </ColumnsDirective>
              <Inject services={[Page, Filter, Sort, Selection]} />
            </GridComponent>
            {isFetching && (
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <FacebookCircularProgress size={40} />
              </Box>
            )}
          </Box>

          <PadBox padding={{ paddingBottom: "10px" }}>
            {pageSetting.totalRecords > 0 && (
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                width="100%"
              >
                <Typography variant="body1">
                  Rows per page: {defaultPageSize}
                </Typography>
                <Pagination
                  count={pageSetting.totalRecords}
                  page={pageSetting.currentPage}
                  onChange={(_, page: number) => onPageChange(page)}
                />
              </Stack>
            )}
          </PadBox>
        </>
      )}
      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
