import { LoadingCell, Tooltip } from "@codezee/sixtify-brahma";
import { Avatar, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useMemo } from "react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import {
  FIRST_HALF_WEEKLY_OFF,
  HOLIDAY,
  SECOND_HALF_WEEKLY_OFF,
  WEEKLY_OFF,
} from "../../../../../common/Autocomplete/hooks/constant";
import type { ShiftPlanner } from "./useGetShiftPlanners";

type DayInfo = {
  day: number;
  weekday: string;
};

type DaysArray = DayInfo[];

type ShiftPlannerColumns = {
  loading: boolean;
  daysArray: DaysArray;
};

export const useShiftPlannerColumns = ({
  loading,
  daysArray,
}: AgColumnsArgs<ShiftPlannerColumns>) => {
  const theme = useTheme();

  const { darkOrange, iron, lightSlateBlue, butterflyBlue } =
    theme.palette.app.color;

  const standardColumns: AgColumnsWithActions<ShiftPlanner> = [
    {
      pinned: "left",
      minWidth: 300,
      headerName: "Employee",
      field: "employee_name",
      cellRenderer: ({ data }: CustomCellRendererProps<ShiftPlanner>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data?.avatar && !data?.employee_name) {
          return null;
        }

        return (
          <Stack direction="row" gap="10px" alignItems="center">
            <Avatar src={data.avatar} alt="Employee Photo" />
            <Typography
              sx={{
                width: "100%",
                ":hover": {
                  color: butterflyBlue[900],
                },
              }}
            >
              {data.employee_name ?? "-"} ({data.employee_code})
            </Typography>
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      pinned: "left",
      minWidth: 200,
      headerName: "Department",
      field: "department_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      pinned: "left",
      minWidth: 200,
      headerName: "Sub Department",
      field: "sub_department_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      pinned: "left",
      width: 150,
      maxWidth: 300,
      headerName: "Shift",
      field: "shift_type_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
  ];

  // TODO: Bhavik need to fix typescript error any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dayColumns: any = daysArray?.map(({ day, weekday }) => {
    const dayFormatted = `${day} ${weekday}`;

    return {
      headerComponentParams: {
        template: `
                 <div>
                <span>${day}</span></br>
                <span>${weekday}</span>
                </div>
              `,
      },
      minWidth: 80,
      headerName: dayFormatted,
      field: "days",
      cellStyle: ({ data }: CustomCellRendererProps<ShiftPlanner>) => {
        if (!data?.days?.[day]) {
          return null;
        }

        const dayData = data?.days?.[day];

        if (dayData) {
          switch (dayData.dayType) {
            case WEEKLY_OFF:
              return {
                background: darkOrange[600],
              };

            case FIRST_HALF_WEEKLY_OFF:
              return {
                borderBottom: "0px",
                background: `linear-gradient(to top, ${iron[600]} 50%, ${darkOrange[600]} 50%)`,
              };

            case SECOND_HALF_WEEKLY_OFF:
              return {
                borderTop: "0px",
                background: `linear-gradient(to bottom, ${iron[600]} 50%, ${darkOrange[600]} 50%)`,
              };

            case HOLIDAY:
              return {
                background: lightSlateBlue[600],
              };

            default:
              return null;
          }
        }
      },

      cellRenderer: ({ data }: CustomCellRendererProps<ShiftPlanner>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (data?.days?.[day]) {
          return (
            <Typography
              sx={{
                width: "100%",
                ":hover": {
                  color: butterflyBlue[900],
                },
                textAlign: "center",
              }}
            >
              <Tooltip toolTipLabel={data.days[day].tooltip}>
                {data.days[day].label ?? "-"}
              </Tooltip>
            </Typography>
          );
        }

        return (
          <Typography
            sx={{
              width: "100%",
              ":hover": {
                color: butterflyBlue[900],
              },
            }}
          >
            -
          </Typography>
        );
      },
    };
  });

  const columns = useMemo(() => {
    return [...standardColumns, ...dayColumns];
  }, [daysArray, loading]);

  return { columns };
};
