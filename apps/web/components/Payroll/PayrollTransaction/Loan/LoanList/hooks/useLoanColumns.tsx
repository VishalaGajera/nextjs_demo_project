import {
  ActionCell,
  Chip,
  LoadingCell,
  Tooltip,
} from "@codezee/sixtify-brahma";
import {
  CancelOutlined,
  CheckCircleOutlineOutlined,
} from "@mui/icons-material";
import { alpha, Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize, round } from "lodash";
import { useRouter } from "next/navigation";
import type { AgColumnsWithActions } from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../../utils/date";
import { formatToIndianNumber } from "../../../../../../utils/helper";
import {
  APPROVE,
  CANCEL,
  REJECT,
} from "../../../../../common/Autocomplete/hooks/constant";
import { useGetInsterestOptions } from "../../../../../common/Autocomplete/hooks/useGetInterestOptions";
import { useGetStatusOptions } from "../../../../../common/Autocomplete/hooks/useGetStatusOptions";
import { getColorByVariant } from "../../../../../Transactions/Leave/LeaveOverview/LeaveDetails/LeaveBalance/colorVariant";
import type { LoanListType } from "./useGetLoanList";

type UseLoanColumns = {
  onAction: (actionType: DialogTypes, rowData: LoanListType) => void;
  loading: boolean;
};

export const useLoanColumns = ({ onAction, loading }: UseLoanColumns) => {
  const router = useRouter();

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const { statusOptions } = useGetStatusOptions();

  const { interestOptions } = useGetInsterestOptions();

  const columns: AgColumnsWithActions<LoanListType> = [
    {
      headerName: "Employee",
      field: "employee_name",
      cellRenderer: ({ data }: CustomCellRendererProps<LoanListType>) => {
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
              <Typography variant="body2">
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
    },
    {
      sortable: false,
      headerName: "Intrest Type & Rate",
      field: "interest_calculation_type",
      cellRenderer: ({ data }: CustomCellRendererProps<LoanListType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Box>
            <Typography variant="body2">
              {capitalize(data.interest_calculation_type)}
            </Typography>

            <Typography
              color={butterflyBlue[400]}
              fontWeight={400}
              variant="body2"
            >
              {data.interest_rate} %
            </Typography>
          </Box>
        );
      },
      filter: CustomEnumFilter,
      filterParams: { filterOptions: interestOptions },
    },
    {
      headerName: "EMI Terms",
      field: "emi_terms_total",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Loan Amount & Category",
      field: "amount",
      cellRenderer: ({ data }: CustomCellRendererProps<LoanListType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Box>
            <Typography variant="body2">
              {formatToIndianNumber(data.amount)}
            </Typography>

            <Typography
              color={butterflyBlue[400]}
              fontWeight={400}
              variant="body2"
            >
              {data.loan_category_name}
            </Typography>
          </Box>
        );
      },
      sortable: true,
      filter: "agNumberColumnFilter",
      floatingFilter: false,
    },
    {
      headerName: "Total Intrest",
      field: "total_interest",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value && formatToIndianNumber(round(value));
      },
      sortable: true,
      filter: "agNumberColumnFilter",
      floatingFilter: false,
    },
    {
      headerName: "Total EMI Amount",
      field: "emi_amount",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? formatToIndianNumber(round(value)) : "-";
      },
      sortable: true,
      filter: "agNumberColumnFilter",
      floatingFilter: false,
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
      filter: CustomEnumFilter,
      filterParams: { filterOptions: statusOptions },
    },
    {
      minWidth: 180,
      headerName: "Last Action By/Date",
      field: "last_action_by",
      sortable: true,

      cellRenderer: ({ data }: CustomCellRendererProps<LoanListType>) => {
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
      field: "next_approvers",
      sortable: true,
      cellRenderer: ({ value }: CustomCellRendererProps<LoanListType>) => {
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
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      lockPinned: true,
      maxWidth: 120,
      cellRenderer: ({ data }: CustomCellRendererProps<LoanListType>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const view = {
          title: "View",
          onClick: () =>
            router.push(
              `/payroll/payroll-transaction/loan?page=view-loan&id=${data.id}`
            ),
        };

        const cancel = {
          title: "Cancel",
          onClick: () => onAction && onAction(CANCEL, data),
        };

        const edit = {
          title: "Edit",
          onClick: () => onAction && onAction("edit", data),
        };

        const del = {
          title: "Delete",
          onClick: () => onAction("delete", data),
        };

        const getItemsByStatus = (status: string) => {
          switch (status) {
            case "rejected": {
              return [view, del];
            }

            case "cancelled": {
              return [view, del];
            }

            case "approved": {
              return [view, cancel];
            }

            default: {
              return [view, edit, del, cancel];
            }
          }
        };

        return (
          <Stack direction="row" gap="10px" alignItems="center">
            {data.status === "pending" && (
              <>
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
              </>
            )}

            <ActionCell items={getItemsByStatus(data.status)} />
          </Stack>
        );
      },
    },
  ];

  return { columns };
};
