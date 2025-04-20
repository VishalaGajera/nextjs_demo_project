import { LoadingCell } from "@codezee/sixtify-brahma";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../../../types/agGrid";
import { formatToIndianNumber } from "../../../../../../../../../../utils/helper";
import type {
  EmployeeSalaryTimeline,
  SalaryComponentAllocation,
} from "../../../../../../Hooks/useGetSalaryTimeline";

type UseGetTotalEarningColumns = {
  loading?: boolean;
  salaryTimeLine: EmployeeSalaryTimeline;
};

const columnHeaders: Record<string, string> = {
  monthly: "Monthly",
  annually: "Annually",
  daily: "Daily",
  hourly: "Hourly",
};

export const useGetTotalEarningColumns = ({
  loading = false,
  salaryTimeLine,
}: AgColumnsArgs<UseGetTotalEarningColumns>) => {
  const salaryCalculationType =
    salaryTimeLine.salary_details.salary_structure_interval;

  const commonColumn: AgColumnsWithActions<SalaryComponentAllocation> = [
    {
      headerName: columnHeaders[salaryCalculationType],
      field: "salary_component_value",
      suppressMovable: true,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return formatToIndianNumber(value) ?? "-";
      },
      sortable: false,
    },
  ];

  const isCommonColumn =
    salaryCalculationType !== "annually" && salaryCalculationType !== "monthly";

  const monthlyColumn: AgColumnsWithActions<SalaryComponentAllocation> =
    salaryCalculationType === "monthly"
      ? [
          {
            headerName: "Monthly",
            suppressMovable: true,
            field: "salary_component_value",
            cellRenderer: ({ value }: CustomCellRendererProps) => {
              if (loading) {
                return <LoadingCell />;
              }

              return formatToIndianNumber(value) ?? 0;
            },
          },
          {
            headerName: "Annually",
            suppressMovable: true,
            field: "salary_component_value",
            cellRenderer: ({ value }: CustomCellRendererProps) => {
              if (loading) {
                return <LoadingCell />;
              }

              return value ? formatToIndianNumber(value * 12) : 0;
            },
            sortable: false,
          },
        ]
      : commonColumn;

  const annuallyColumn: AgColumnsWithActions<SalaryComponentAllocation> =
    salaryCalculationType === "annually"
      ? [
          {
            headerName: "Monthly",
            suppressMovable: true,
            field: "salary_component_value",
            cellRenderer: ({ value }: CustomCellRendererProps) => {
              if (loading) {
                return <LoadingCell />;
              }

              return value ? value / 12 : 0;
            },
            sortable: false,
          },
          {
            headerName: "Annually",
            field: "salary_component_value",
            cellRenderer: ({ value }: CustomCellRendererProps) => {
              if (loading) {
                return <LoadingCell />;
              }

              return value ?? "-";
            },
            sortable: false,
          },
        ]
      : commonColumn;

  const columns: AgColumnsWithActions<SalaryComponentAllocation> = [
    {
      headerName: "Earnings",
      suppressMovable: true,
      field: "salary_structure_component_allocation_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return formatToIndianNumber(value);
      },
      sortable: false,
    },

    ...(salaryCalculationType === "monthly" ? monthlyColumn : []),

    ...(salaryCalculationType === "annually" ? annuallyColumn : []),

    ...(isCommonColumn ? commonColumn : []),
  ];

  return { columns };
};
