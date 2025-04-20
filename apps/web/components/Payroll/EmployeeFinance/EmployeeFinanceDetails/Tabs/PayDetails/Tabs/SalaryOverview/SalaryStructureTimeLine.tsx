import { Button, PadBox } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { useGetSalaryTimeline } from "../../../../Hooks/useGetSalaryTimeline";
import { SALARY_OVERVIEW } from "../../../constants";
import { SalaryOverview } from "./SalaryOverview";

type SalaryStructureTimeLineProps = {
  employeeId: string;
  tab: string;
  isSetupPendingStatus: boolean;
  isLoading: boolean;
  pageType?: "form" | "dialog";
  onDialogOpen?: (dialogTypes: DialogTypes) => void;
  action?: DialogTypes;
};

export const SalaryStructureTimeLine = ({
  employeeId,
  isSetupPendingStatus,
  tab,
  isLoading,
  pageType = "form",
  action,
  onDialogOpen,
}: SalaryStructureTimeLineProps) => {
  const theme = useTheme();

  const { iron, mirage } = theme.palette.app.color;

  const [openedTimelineId, setOpenedTimelineId] = useState("");

  const { data } = useGetSalaryTimeline({ employeeId });

  const router = useRouter();

  const onSetupClick = () => {
    if (pageType === "form") {
      router.push(
        `/payroll/employee-finance/${employeeId}/salary-setup?tab=${tab}?&detail=${SALARY_OVERVIEW}`
      );
    }

    if (onDialogOpen && action) {
      onDialogOpen(action);
    }
  };

  if (isSetupPendingStatus && !isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        gap="20px"
        height="calc(90vh - 280px)"
        sx={{ bgcolor: iron[600] }}
      >
        <Typography variant="h5" sx={{ color: mirage[900], fontWeight: 500 }}>
          Salary setup is pending.
        </Typography>

        <Typography sx={{ color: iron[800] }} variant="h6">
          Salary details are missing for this employee. Please setup them below.
        </Typography>

        <Button variant="outlined" onClick={onSetupClick}>
          Setup Now
        </Button>
      </Stack>
    );
  }

  if (!isSetupPendingStatus && !isLoading) {
    return (
      <Box sx={{ bgcolor: iron[600] }}>
        <PadBox padding={{ padding: "35px" }}>
          <Stack gap="20px">
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: mirage[900] }} variant="h6">
                Salary Timeline
              </Typography>

              <Button variant="outlined">Revise Salary</Button>
            </Stack>

            {data.map((salaryTimeline, index) => {
              return (
                <SalaryOverview
                  salaryTimeLine={salaryTimeline}
                  setOpenedTimelineId={setOpenedTimelineId}
                  openedTimelineId={openedTimelineId}
                  index={index}
                  length={data.length}
                  key={uuidv4()}
                />
              );
            })}
          </Stack>
        </PadBox>
      </Box>
    );
  }
};
