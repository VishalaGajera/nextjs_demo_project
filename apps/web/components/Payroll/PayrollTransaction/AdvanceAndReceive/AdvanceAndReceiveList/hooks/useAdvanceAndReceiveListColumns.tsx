import { ActionCell, formatDate, LoadingCell } from "@codezee/sixtify-brahma";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../../utils/date";
import { formatToIndianNumber } from "../../../../../../utils/helper";
import { useGetComponentTypeOptions } from "../../../../../common/Autocomplete/hooks/useGetComponentTypeOptions";
import { paymentTypeOption } from "../../../../../common/Autocomplete/PaymentTypeAutoComplete";
import type { AdvanceAndReceive } from "./useGetAdvanceAndReceiveList";

type UseAdvanceAndReceiveListColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: AdvanceAndReceive) => void;
};

export const useAdvanceAndReceiveListColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseAdvanceAndReceiveListColumns>) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const { componentTypeOptions } = useGetComponentTypeOptions();

  const columns: AgColumnsWithActions<AdvanceAndReceive> = [
    {
      headerName: "Employee",
      field: "employee_name",
      cellRenderer: ({ data }: CustomCellRendererProps<AdvanceAndReceive>) => {
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
      headerName: "Tran Date/Deduct Month",
      field: "transaction_date",
      cellRenderer: ({ data }: CustomCellRendererProps<AdvanceAndReceive>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Box>
            <Typography variant="body2">
              {formatDate(data.transaction_date, "dd-LLL-yyyy")}
            </Typography>

            <Typography
              color={butterflyBlue[400]}
              fontWeight={400}
              variant="body2"
            >
              {formatDate(data.deduction_month, "LLL-yyyy")}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerName: "Component",
      field: "component_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? capitalize(value) : "-";
      },
      filter: CustomEnumFilter,
      filterParams: { filterOptions: componentTypeOptions },
      sortable: true,
    },
    {
      headerName: "Transaction Type",
      field: "transaction_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? capitalize(value) : "-";
      },
      filter: CustomEnumFilter,
      filterParams: { filterOptions: paymentTypeOption },
      sortable: true,
    },
    {
      headerName: "Amount",
      field: "amount",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return formatToIndianNumber(value) ?? "-";
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Remark",
      field: "remark",
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
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      cellRenderer: ({ data }: CustomCellRendererProps<AdvanceAndReceive>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Box>
            <Typography variant="body2">{data.action_by}</Typography>

            <Typography variant="body2">
              {dateFormat(data.action_at)}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 70,
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<AdvanceAndReceive>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          <ActionCell
            items={[
              { title: "View", onClick: () => onAction("view", data) },
              { title: "Edit", onClick: () => onAction("edit", data) },
              { title: "Delete", onClick: () => onAction("delete", data) },
            ]}
          ></ActionCell>
        );
      },
    },
  ];

  return { columns };
};
