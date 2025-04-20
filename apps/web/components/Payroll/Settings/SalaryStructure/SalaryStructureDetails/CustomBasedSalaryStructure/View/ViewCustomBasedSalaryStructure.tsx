import {
  Button,
  FormGridLayout,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { capitalize } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import { SalaryStructureComponentForm } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/SalaryStructureComponent/SalaryStructureComponentForm";
import type { SalaryIntervals } from "../../RangeBasedSalaryStructure/Add/SalaryRangeSideBar/Hooks/useGetSalaryRangeList";
import {
  customSalaryComponentAllocationsSchema,
  CUSTOMSALARYHEADERS,
  type CustomSalaryComponentAllocationsType,
} from "../Add/AddCustomBasedSalaryStructure";
import { useGetCustomSalaryStructureById } from "../Edit/hook/useGetCustomSalaryStructureById";

type ViewCustomBasedSalaryStructureProps = {
  ssId: string;
  csId: string;
};

export const ViewCustomBasedSalaryStructure = ({
  ssId,
  csId,
}: ViewCustomBasedSalaryStructureProps) => {
  const theme = useTheme();

  const { t } = useTranslation();

  const router = useRouter();

  const { iron, slate } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const interval = searchParams.get("interval") as SalaryIntervals;

  const { data: viewCustomSalaryDetailsById, isFetching } =
    useGetCustomSalaryStructureById({
      ssId,
      csId,
    });

  const {
    salary_structure_name,
    salary_component_allocations = [],
    description,
  } = viewCustomSalaryDetailsById ?? {};

  const defaultViewCustomSalaryAllocations = salary_component_allocations?.map(
    (component) => {
      return {
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

  const values = {
    salary_component_allocations: defaultViewCustomSalaryAllocations,
    salary_structure_name: salary_structure_name ?? "",
    description,
    salary_interval: interval,
  };

  const formMethods = useForm<CustomSalaryComponentAllocationsType>({
    values,
    mode: "all",
    resolver: zodResolver(customSalaryComponentAllocationsSchema),
  });

  const {
    watch,
    control,
    formState: { errors },
  } = formMethods;

  useEnableDisableButton({
    control,
    defaultValues: values,
    errors,
  });

  const goBack = () => {
    router.push(
      `/payroll/settings/salary-structure/salary-structure-details/${ssId}?interval=${interval}&list=custom`
    );
  };

  const { fields } = useFieldArray({
    name: "salary_component_allocations",
    control,
  });

  const isOnlyOneAdjustmentSelected =
    watch("salary_component_allocations").filter(
      (component) => component.calculation_type === "adjustment"
    ).length === 1;

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <>
      <Box bgcolor={iron[600]} borderRadius="4px">
        <PadBox padding={{ padding: "15px" }}>
          <Typography color={iron[400]} variant="h6">
            View {capitalize(interval)} Custom Based Salary Structure
          </Typography>
        </PadBox>
      </Box>

      <FormProvider {...formMethods}>
        <Stack gap="10px" width="100%">
          <Box
            sx={{ width: "100%", borderRadius: "4px", background: iron[600] }}
          >
            <PadBox padding={{ padding: "15px" }}>
              <FormGridLayout columns={3}>
                <TextField
                  control={control}
                  label="Structure Name"
                  placeholder="Structure Name"
                  name="salary_structure_name"
                  error={!!errors.salary_structure_name}
                  helperText={errorMessages(
                    errors.salary_structure_name?.message
                  )}
                  loading={isFetching}
                  disabled
                />

                <TextField
                  control={control}
                  label="Description"
                  placeholder="Description"
                  name="description"
                  error={!!errors.description}
                  helperText={errorMessages(errors.description?.message)}
                  disabled
                  loading={isFetching}
                />
              </FormGridLayout>
            </PadBox>
          </Box>

          <Box
            sx={{ width: "100%", borderRadius: "4px", background: iron[600] }}
          >
            <PadBox padding={{ padding: "10px" }}>
              <Typography variant="h6" sx={{ color: slate[900] }}>
                Earnings
              </Typography>
            </PadBox>
          </Box>

          <Box
            sx={{
              borderRadius: "4px",
              background: iron[600],
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: slate[700] }}>
                  {CUSTOMSALARYHEADERS.map((header) => (
                    <TableCell key={uuidv4()}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {fields.map((field, index) => {
                return (
                  <SalaryStructureComponentForm
                    formType="custom"
                    key={field.id}
                    index={index}
                    isOnlyOneAdjustmentSelected={isOnlyOneAdjustmentSelected}
                    disabled={true}
                    isLoading={isFetching}
                    calculatedValues={{}}
                  />
                );
              })}
            </Table>
          </Box>

          <Stack direction="row" width="100%" justifyContent="end">
            <Button variant="outlined" onClick={goBack}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </>
  );
};
