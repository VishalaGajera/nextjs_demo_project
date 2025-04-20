import { AgGrid } from "@codezee/sixtify-brahma";
import type { AgGridReact } from "ag-grid-react";
import { useRef } from "react";

import { useTheme } from "@mui/material";
import { sumBy } from "lodash";
import type { AgDataWithActions } from "../../../../../../../../../types/agGrid";
import type {
  EmployeeSalaryTimeline,
  SalaryComponentAllocation,
} from "../../../../../Hooks/useGetSalaryTimeline";
import { useGetTotalEarningColumns } from "./Hooks/useGetTotalEarningColumns";

type TotalEarningListProps = {
  salaryTimeLine: EmployeeSalaryTimeline;
};

export type TotalEarningListRefType = {
  refresh: () => void;
};

export const TotalEarningList = ({ salaryTimeLine }: TotalEarningListProps) => {
  const gridRef = useRef<AgGridReact<SalaryComponentAllocation>>(null);

  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const { salary_component_allocations: salaryComponentAllocations } =
    salaryTimeLine.salary_details;

  const { columns } = useGetTotalEarningColumns({
    salaryTimeLine,
  });

  const totalValue = sumBy(
    salaryComponentAllocations,
    "salary_component_value"
  );

  const pinnedBottomRowData = [
    {
      salary_structure_component_allocation_name: "Total Earnings",
      salary_component_value: totalValue,
    },
  ];

  return (
    <AgGrid<AgDataWithActions<SalaryComponentAllocation>>
      ref={gridRef}
      columnDefs={columns}
      rowData={salaryComponentAllocations ?? []}
      rowModelType="clientSide"
      getRowStyle={(params) => {
        if (params.node.rowPinned === "bottom") {
          return {
            backgroundColor: slate[800] ?? "",
            fontWeight: "bold",
            pointerEvents: "none",
          };
        }
      }}
      pinnedBottomRowData={pinnedBottomRowData}
      height="350px"
    />
  );
};
