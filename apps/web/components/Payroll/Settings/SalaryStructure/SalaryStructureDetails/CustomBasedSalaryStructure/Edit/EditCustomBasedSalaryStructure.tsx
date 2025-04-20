import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Typography, useTheme } from "@mui/material";
import { capitalize } from "lodash";
import { useSearchParams } from "next/navigation";
import type { SalaryIntervals } from "../../RangeBasedSalaryStructure/Add/SalaryRangeSideBar/Hooks/useGetSalaryRangeList";
import type { CustomSalaryComponentAllocationsType } from "../Add/AddCustomBasedSalaryStructure";
import { EditCustomBasedSalaryStructureForm } from "./EditCustomBasedSalaryStructureForm";
import { useGetCustomSalaryStructureById } from "./hook/useGetCustomSalaryStructureById";

type EditCustomBasedSalaryStructureProps = {
  ssId: string;
  csId: string;
};

export const EditCustomBasedSalaryStructure = ({
  csId,
  ssId,
}: EditCustomBasedSalaryStructureProps) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const interval = searchParams.get("interval") as SalaryIntervals;

  const { data: customSalaryDetailsById, isFetching } =
    useGetCustomSalaryStructureById({
      ssId,
      csId,
    });

  const {
    salary_structure_name: customSalaryStructureName,
    salary_component_allocations: salaryComponentAllocations = [],
    description: customSalaryStructureDescription,
  } = customSalaryDetailsById ?? {};

  const defaultCustomSalaryAllocations = salaryComponentAllocations?.map(
    (component) => {
      return {
        action: "update",
        id: component.id,
        salary_component_id: component.salary_component_id,
        calculation_type: component.calculation_type,
        percentage_value: component.percentage_value,
        fixed_amount: component.fixed_amount,
        depends_on_salary_component_id:
          component.depends_on_salary_component_id,
        salary_component_name: component.salary_component.component_name,
        salary_component_code: component.salary_component.component_code,
      };
    }
  );

  const defaultValues: CustomSalaryComponentAllocationsType = {
    salary_structure_name: customSalaryStructureName ?? "",
    description: customSalaryStructureDescription,
    salary_component_allocations: defaultCustomSalaryAllocations,
    salary_interval: interval,
  };

  return (
    <>
      <Box bgcolor={iron[600]} borderRadius="4px">
        <PadBox padding={{ padding: "15px" }}>
          <Typography color={iron[400]} variant="h6">
            Edit {capitalize(interval)} Custom Based Salary Structure
          </Typography>
        </PadBox>
      </Box>

      <EditCustomBasedSalaryStructureForm
        ssId={ssId}
        csId={csId}
        isLoading={isFetching}
        defaultValues={defaultValues}
      />
    </>
  );
};
