import {
  CheckBox,
  Chip,
  formatDate,
  getTimeInHHmm,
  LoadingCell,
  Tooltip,
} from "@codezee/sixtify-brahma";
import {
  CancelOutlined,
  CheckCircleOutlineOutlined,
} from "@mui/icons-material";
import { alpha, Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import type { MouseEvent } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigateToRoute } from "../../../../../../hooks/useNavigateToRoute";
import type { AgColumnsWithActions } from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../utils/date";
import {
  APPROVE,
  REJECT,
} from "../../../../../common/Autocomplete/hooks/constant";
import { getColorByVariant } from "../../../../Leave/LeaveOverview/LeaveDetails/LeaveBalance/colorVariant";
import type { OvertimeFormValues } from "../../Overtime";
import type { OvertimeType } from "./useGetOvertimeList";

type UseOvertimeListColumns = {
  onAction?: (actionType: DialogTypes, rowData: OvertimeType) => void;
  combinedData: OvertimeType[];
  overtimeRequestIds: string[];
  loading: boolean;
  handleSelect: (event: MouseEvent<HTMLButtonElement>) => void;
  handleSingleChecked: (
    event: MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
};

export const useGetOvertimeListColumns = ({
  onAction,
  loading,
  handleSelect,
  handleSingleChecked,
  overtimeRequestIds,
  combinedData,
}: UseOvertimeListColumns) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const navigateToNewPage = useNavigateToRoute();

  const { control } = useFormContext<OvertimeFormValues>();

  const checkboxHeaderComponent = () => {
    return (
      <CheckBox
        name="checkAll"
        control={control}
        size="small"
        onClick={handleSelect}
        indeterminate={
          (overtimeRequestIds.length &&
            overtimeRequestIds.length < combinedData.length) ||
          false
        }
        disabled={!combinedData.length}
      />
    );
  };

  const columns: AgColumnsWithActions<OvertimeType> = [
    {
      headerComponent: checkboxHeaderComponent,
      field: "selected",
      minWidth: 50,
      maxWidth: 50,
      pinned: "left",
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<OvertimeType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <CheckBox
            name={`selectedRecords.${data.id}`}
            control={control}
            loading={loading}
            size="small"
            onClick={(event) => handleSingleChecked(event, data.id)}
          />
        );
      },
      sortable: false,
      filter: false,
    },
    {
      minWidth: 200,
      headerName: "Employee",
      field: "employee_name",
      pinned: "left",
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<OvertimeType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data?.avatar && !data?.employee_name) {
          return null;
        }

        return (
          <Stack direction="row" gap="10px" alignItems="center">
            <Avatar src={data.avatar} alt="Employee Photo" />

            <Box>
              <Typography
                sx={{
                  width: "100%",
                  cursor: "pointer",
                  color: butterflyBlue[900],
                }}
                onMouseDown={(e: MouseEvent<HTMLSpanElement>) => {
                  navigateToNewPage(
                    e,
                    `/employee-management/employee/${data.employee_id}?tab=attendance&type=day&view=list_view`
                  );
                }}
              >
                {data.employee_name ?? "-"}
              </Typography>

              <Typography variant="body2" color={butterflyBlue[400]}>
                {data.employee_code ?? "-"}
              </Typography>
            </Box>
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
      floatingFilter: false,
    },
    {
      minWidth: 180,
      headerName: "Punch Code",
      field: "punch_code",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 180,
      headerName: "Department",
      field: "department_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: false,
    },
    {
      minWidth: 120,
      headerName: "Overtime Date",
      field: "overtime_date",
      sortable: true,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? formatDate(value) : "-"}
          </Typography>
        );
      },
    },
    {
      minWidth: 170,
      headerName: "Requested By/Date",
      field: "requested_by",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<OvertimeType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack>
            <Typography variant="body2">
              {data.last_action_type == "auto"
                ? "System Generated"
                : data.requested_by}
            </Typography>

            <Typography variant="body2">
              {data.requested_date ? dateFormat(data.requested_date) : "-"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      minWidth: 110,
      headerName: "In/Out OT",
      field: "in_time_overtime",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<OvertimeType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack flexDirection="row" alignItems="center" gap="3px">
            <Typography variant="body2">
              {data.in_time_overtime
                ? getTimeInHHmm(data.in_time_overtime)
                : "-"}
            </Typography>
            /
            <Typography variant="body2">
              {data.out_time_overtime
                ? getTimeInHHmm(data.out_time_overtime)
                : "-"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      minWidth: 100,
      headerName: "Requested OT",
      field: "request_overtime_work_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!value) {
          return null;
        }

        return getTimeInHHmm(value);
      },
      sortable: true,
    },
    {
      minWidth: 130,
      headerName: "Remark",
      field: "remark",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
    },
    {
      minWidth: 120,
      headerName: "Status",
      field: "status",
      sortable: true,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Chip
            label={value ? capitalize(value) : "-"}
            sx={{
              width: "fit-content",
              color: getColorByVariant(value),
              backgroundColor: alpha(
                getColorByVariant(value) ?? "transparent",
                0.2
              ),
            }}
          />
        );
      },
    },
    {
      minWidth: 180,
      headerName: "Last Action By/Date",
      field: "last_action_by",
      sortable: true,

      cellRenderer: ({ data }: CustomCellRendererProps<OvertimeType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        if (!data.last_action_type) {
          return "-";
        }

        return (
          <Tooltip toolTipLabel={data.last_action_remark}>
            <Typography variant="body2">
              {data.last_action_type == "auto"
                ? "System Approved"
                : data.last_action_by}
            </Typography>

            <Typography variant="body2">
              {data.last_action_at ? dateFormat(data.last_action_at) : "-"}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      minWidth: 150,
      headerName: "Next Approver",
      field: "next_approver",
      sortable: true,
      cellRenderer: ({ value }: CustomCellRendererProps<OvertimeType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? value.join(", ") : "-"}
          </Typography>
        );
      },
    },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      pinned: "right",
      lockPinned: true,
      maxWidth: 120,
      cellRenderer: ({ data }: CustomCellRendererProps<OvertimeType>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          <Stack direction="row" gap="10px" alignItems="center">
            <CheckCircleOutlineOutlined
              fontSize="medium"
              color="success"
              style={{ cursor: "pointer" }}
              onClick={() => onAction && onAction(APPROVE, data)}
            />

            <CancelOutlined
              fontSize="medium"
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() => onAction && onAction(REJECT, data)}
            />
          </Stack>
        );
      },
    },
  ];

  return { columns };
};
