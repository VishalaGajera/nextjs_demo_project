import { ListItemButton, PadBox } from "@codezee/sixtify-brahma";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Box,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { type SalaryStructureComponent } from "../../Add/SalaryRangeRightModule/Dialogs/Hooks/useGetSalaryComponentsList";
import { type SalaryIntervals } from "../../Add/SalaryRangeSideBar/Hooks/useGetSalaryRangeList";
import { type SalaryRangeType } from "../../Add/SalaryRangeSideBar/SalaryRangeForm";

type EarningSidebarProps = {
  ssId: string;
  interval: SalaryIntervals;
  salaryRanges?: SalaryRangeType[];
  isLoading: boolean;
  getEarnings: (earning: SalaryStructureComponent) => string;
  salaryComponentsList: SalaryStructureComponent[];
};

export const EarningSidebar = ({
  ssId,
  interval,
  salaryRanges = [],
  salaryComponentsList,
  getEarnings,
  isLoading = true,
}: EarningSidebarProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const router = useRouter();

  const params = useSearchParams();

  const component = params.get("component") ?? "";

  const tab = params.get("tab") ?? "";

  const list = params.get("list") ?? "";

  const getPath = (componentCode: string, tabId: string) => {
    return `/payroll/settings/salary-structure/salary-structure-details/${ssId}?interval=${interval}&tab=${tabId}&component=${componentCode}&list=${list}`;
  };

  const onItemClick = (componentCode: string) => {
    const path = getPath(componentCode, tab);

    if (componentCode) {
      router.push(path);
    }
  };

  useEffect(() => {
    const isValidRangeId = salaryRanges?.find((item) => {
      return item.id === tab;
    });

    const tabId = isValidRangeId ? isValidRangeId.id : salaryRanges?.[0]?.id;

    if (tabId && ssId && interval) {
      const path = getPath("BASIC", tabId);

      router.push(path);
    }
  }, [salaryRanges]);

  return (
    <Box
      sx={{
        height: "calc(85vh - 253px)",
        overflowY: "auto",
        marginRight: "15px",
      }}
    >
      <Stack gap="10px">
        {isLoading ? (
          Array.from({ length: 4 }).map(() => (
            <Skeleton
              key={uuidv4()}
              variant="rectangular"
              height="60px"
              sx={{ borderRadius: "5px" }}
            />
          ))
        ) : // eslint-disable-next-line sonarjs/no-nested-conditional
        (salaryRanges?.length ?? 0) > 0 ? (
          salaryComponentsList?.map((earning) => {
            return (
              <ListItemButton
                key={earning.id}
                sx={{
                  maxWidth: "300px",
                  "& .css-wc634t-MuiTypography-root ": {
                    maxWidth: "200px",
                  },
                }}
                actions={
                  earning.salary_component.component_code === "BASIC" ? (
                    <LockOutlinedIcon sx={{ color: slate[900] }} />
                  ) : (
                    <></>
                  )
                }
                onClick={() =>
                  onItemClick(earning.salary_component.component_code)
                }
                label={`${earning.salary_component.component_name}`}
                companyName={getEarnings(earning)}
                selected={component === earning.salary_component.component_code}
              />
            );
          })
        ) : (
          <PadBox padding={{ paddingY: "15px" }}>
            <Alert severity="error">
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                No Salary Range Found.
              </Typography>
            </Alert>
          </PadBox>
        )}
      </Stack>
    </Box>
  );
};
