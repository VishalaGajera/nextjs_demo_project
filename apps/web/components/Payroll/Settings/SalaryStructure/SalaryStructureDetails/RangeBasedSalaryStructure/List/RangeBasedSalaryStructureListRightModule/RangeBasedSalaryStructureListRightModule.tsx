import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { sum } from "lodash";
import { useSearchParams } from "next/navigation";
import { formatToIndianNumber } from "../../../../../../../../utils/helper";
import {
  type SalaryStructureComponent,
  useGetSalaryComponentsList,
} from "../../Add/SalaryRangeRightModule/Dialogs/Hooks/useGetSalaryComponentsList";
import { calculateDependedPercentage } from "../../Add/SalaryRangeRightModule/utils/calculateDependedPercentage";
import { type SalaryIntervals } from "../../Add/SalaryRangeSideBar/Hooks/useGetSalaryRangeList";
import { type SalaryRangeSidebarProps } from "../../Add/SalaryRangeSideBar/SalaryRangeSideBar";
import { EarningDetail } from "./EarningDetail";
import { EarningSidebar } from "./EarningSidebar";

export const initialEarning: SalaryStructureComponent = {
  id: "",
  calculation_type: "fixed",
  fixed_amount: null,
  percentage_value: null,
  depends_on_salary_component_id: null,
  depends_on_salary_component: {
    component_name: "",
    component_code: "",
    is_taxable: true,
    recurring: true,
  },
  salary_component_id: "",
  salary_component: {
    component_name: "",
    component_code: "",
    is_taxable: true,
    recurring: true,
  },
  selected: true,
};

export const RangeBasedSalaryStructureListRightModule = ({
  interval,
  ssId,
  isLoading,
  salaryRanges,
}: SalaryRangeSidebarProps) => {
  const theme = useTheme();

  const { slate, iron, butterflyBlue } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const salaryRangeId = searchParams.get("tab") as SalaryIntervals;

  const salaryRange = salaryRanges?.find((range) => range.id === salaryRangeId);

  const range =
    // eslint-disable-next-line sonarjs/prefer-nullish-coalescing
    salaryRange?.from_range || salaryRange?.to_range
      ? `${formatToIndianNumber(salaryRange?.from_range)} - ${formatToIndianNumber(salaryRange?.to_range)}`
      : "";

  const { data: salaryComponentsList = [] } = useGetSalaryComponentsList({
    interval,
    salaryRangeId,
    ssId,
  });

  const { calculatedValues } = calculateDependedPercentage({
    payLoad: {
      salary_component_allocations: salaryComponentsList.map((component) => {
        return {
          calculation_type: component.calculation_type,
          action: "add",
          depends_on_salary_component_id:
            component.depends_on_salary_component_id,
          fixed_amount: component.fixed_amount,
          percentage_value: component.percentage_value,
          salary_component_id: component.salary_component_id,
          selected: component.selected,
          id: component.id,
          salary_component_code: component.salary_component.component_code,
          salary_component_name: component.salary_component.component_name,
        };
      }),
    },
    totalValue: salaryRange?.to_range ?? 0,
    isOnlyOneAdjustmentSelected:
      salaryComponentsList.filter(
        (component) => component.calculation_type === "adjustment"
      ).length === 1,
  });

  const adjustmentCount =
    (salaryRange?.to_range ?? 0) - sum(Object.values(calculatedValues));

  const getEarnings = (earning: SalaryStructureComponent) => {
    const { calculation_type, depends_on_salary_component } = earning;

    const dependsComponent = depends_on_salary_component
      ? depends_on_salary_component.component_name
      : "Gross";

    if (calculation_type === "percentage") {
      const percentageAmount = formatToIndianNumber(
        calculatedValues[earning.salary_component_id] ?? 0
      );

      return `[${dependsComponent}] * ${earning.percentage_value ?? 0}% = ${percentageAmount}`;
    }

    if (calculation_type === "fixed") {
      return `Amount : ${formatToIndianNumber(earning.fixed_amount ?? 0)}`;
    }

    if (calculation_type === "adjustment") {
      return `Adj. Amount : ${formatToIndianNumber(adjustmentCount)}`;
    }

    return "";
  };

  return (
    <Stack
      width="100%"
      borderRadius="4px"
      sx={{ background: iron[600], border: `1px solid ${butterflyBlue[300]}` }}
    >
      <Box sx={{ width: "100%", borderRadius: "4px" }}>
        <PadBox padding={{ padding: "20px" }}>
          {isLoading ? (
            <Skeleton height={30} animation="wave" variant="rounded" />
          ) : (
            <Typography variant="h6" sx={{ color: slate[900] }}>
              {range ?? "No Salary Range Found."}
            </Typography>
          )}
        </PadBox>
      </Box>

      <Box sx={{ width: "100%", background: slate[700] }}>
        <PadBox padding={{ padding: "20px" }}>
          <Typography variant="h6">Earnings</Typography>
        </PadBox>
      </Box>

      <PadBox padding={{ padding: "15px" }}>
        <Stack direction="row" justifyContent="start" gap="10px">
          <Stack
            gap="20px"
            marginTop="10px"
            sx={{
              width: "calc(85vh - 400px)",
              overflowY: "auto",
              background: iron[600],
              borderRight: `1px solid  ${butterflyBlue[300]}`,
            }}
          >
            <EarningSidebar
              interval={interval}
              getEarnings={getEarnings}
              salaryComponentsList={salaryComponentsList}
              isLoading={salaryComponentsList.length <= 0}
              ssId={ssId}
              salaryRanges={salaryRanges}
            />
          </Stack>

          <Stack
            gap="20px"
            marginTop="10px"
            sx={{
              overflowY: "auto",
              width: "100%",
              borderRadius: "4px",
              background: iron[600],
            }}
          >
            <EarningDetail
              salaryComponentsList={salaryComponentsList}
              isLoading={salaryComponentsList.length <= 0}
              getEarnings={getEarnings}
            />
          </Stack>
        </Stack>
      </PadBox>
    </Stack>
  );
};
