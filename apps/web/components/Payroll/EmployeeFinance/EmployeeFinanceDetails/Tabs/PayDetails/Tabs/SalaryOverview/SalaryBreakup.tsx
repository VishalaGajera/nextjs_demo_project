import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { capitalize } from "lodash";
import type { EmployeeSalaryTimeline } from "../../../../Hooks/useGetSalaryTimeline";
import { DisplayDetails } from "./DisplayDetails";
import { TotalEarningList } from "./TotalEarningList/TotalEarningList";

type SalaryBreakupProps = {
  salaryTimeLine: EmployeeSalaryTimeline;
};

const SalaryBreakup = ({ salaryTimeLine }: SalaryBreakupProps) => {
  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  const {
    salary_structure_custom_id,
    salary_structure_custom_name,
    salary_structure_name,
  } = salaryTimeLine.salary_details;

  return (
    <PadBox padding={{ padding: "20px" }}>
      <Stack direction="row" gap="40px">
        <Stack width="100%" maxWidth="410px" gap="20px">
          <Typography variant="subtitle1" sx={{ color: butterflyBlue[900] }}>
            Salary Breakup :
          </Typography>

          <Stack gap="10px">
            <DisplayDetails
              header="Salary Structure Name :"
              label={salary_structure_name}
            />

            <DisplayDetails
              header="Salary Structure By :"
              label={capitalize(
                salaryTimeLine.salary_setup.salary_calculation_type
              )}
            />

            <DisplayDetails
              header="Salary Structure Type :"
              label={salary_structure_custom_id ? "Custom" : "Range"}
            />

            {salary_structure_custom_id && (
              <DisplayDetails
                header="Custom Structure Name :"
                label={salary_structure_custom_name ?? ""}
              />
            )}
          </Stack>
        </Stack>

        <Divider sx={{ height: "auto !important" }} orientation="vertical" />

        <Box
          sx={{
            background: iron[600],
            border: `1px solid ${butterflyBlue[300]}`,
            borderRadius: "6px",
            flex: 1,
          }}
        >
          <TotalEarningList salaryTimeLine={salaryTimeLine} />
        </Box>
      </Stack>
    </PadBox>
  );
};

export default SalaryBreakup;
