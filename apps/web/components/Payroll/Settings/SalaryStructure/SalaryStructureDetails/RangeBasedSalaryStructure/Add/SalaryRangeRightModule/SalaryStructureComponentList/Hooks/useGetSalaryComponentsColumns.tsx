import { CheckBox, LoadingCell } from "@codezee/sixtify-brahma";
import type { CustomCellRendererProps } from "ag-grid-react";

import { Typography } from "@mui/material";
import { capitalize } from "lodash";
import { useFormContext } from "react-hook-form";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../../../types/agGrid";
import { formatToIndianNumber } from "../../../../../../../../../../utils/helper";
import { type SalaryComponentAllocationsType } from "../../SalaryStructureRightModule";
import type { SalaryComponentListType } from "./useGetSalaryComponentList";

type useGetSalaryComponentsColumnsProps = {
  loading: boolean;
  savedSalaryComponent: string[];
};

export const useGetSalaryComponentsColumns = ({
  loading,
  savedSalaryComponent,
}: AgColumnsArgs<useGetSalaryComponentsColumnsProps>) => {
  const { control } = useFormContext<SalaryComponentAllocationsType>();

  const columns: AgColumnsWithActions<SalaryComponentListType> = [
    {
      field: "selected",
      headerName: "",
      minWidth: 50,
      maxWidth: 50,
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<SalaryComponentListType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <CheckBox
            name={`selectedRows.${data.earning_component_code}`}
            loading={loading}
            disabled={
              data.earning_component_code === "BASIC" ||
              savedSalaryComponent.includes(data.earning_component_code)
            }
            size="small"
            control={control}
          />
        );
      },
      sortable: false,
      filter: false,
    },
    {
      headerName: "Component Name",
      field: "earning_component_name",
      sortable: false,
      filter: false,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!value) {
          return null;
        }

        return <Typography variant="subtitle2">{value ?? "-"}</Typography>;
      },
    },
    {
      headerName: "Component Type",
      sortable: false,
      filter: false,
      field: "earning_component_type",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? capitalize(value) : "-";
      },
    },
    {
      headerName: "Is Taxable?",
      sortable: false,
      filter: false,
      field: "is_taxable",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<SalaryComponentListType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return data?.is_taxable ? "Taxable" : "Tax Exempt";
      },
    },
    {
      headerName: "Max Limit(Year)",
      field: "max_limit_per_year",
      sortable: false,
      filter: false,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? formatToIndianNumber(value) : "-";
      },
    },
  ];

  return { columns };
};
