import { PadBox } from "@codezee/sixtify-brahma";
import {
  Avatar,
  Box,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { EmployeeFinanceListType } from "../EmployeeFinanceList/Hooks/useGetEmployeeFinanceList";

type EmployeeInfoHeaderProps = {
  loading: boolean;
  employeeData: EmployeeFinanceListType;
};

export const EmployeeInfoHeader = ({
  employeeData,
  loading,
}: EmployeeInfoHeaderProps) => {
  const theme = useTheme();

  const { iron, lightBlue } = theme.palette.app.color;

  if (!employeeData || loading) {
    return (
      <Box bgcolor={lightBlue[50]} sx={{ borderRadius: "5px" }}>
        <PadBox padding={{ padding: 1 }}>
          <Stack flexDirection="row" gap="15px" alignItems="center">
            <Skeleton
              variant="circular"
              height={50}
              animation="wave"
              width="50px"
            />

            <Stack gap="5px">
              <Skeleton
                variant="rounded"
                height={20}
                animation="wave"
                width="90px"
              />

              <Skeleton
                variant="rounded"
                height={20}
                animation="wave"
                width="150px"
              />
            </Stack>
          </Stack>
        </PadBox>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: iron[600], borderRadius: "4px" }}>
      <PadBox padding={{ padding: "15px" }}>
        <Stack direction="row" gap="10px" alignItems="center">
          <Avatar
            sx={{ height: "50px", width: "50px" }}
            src={employeeData.avatar}
          />

          <Box>
            <Typography variant="subtitle1" fontWeight={500}>
              {employeeData.employee_name}
            </Typography>

            <Typography variant="subtitle2" color={iron[500]}>
              {employeeData.designation_name}
            </Typography>
          </Box>
        </Stack>
      </PadBox>
    </Box>
  );
};
