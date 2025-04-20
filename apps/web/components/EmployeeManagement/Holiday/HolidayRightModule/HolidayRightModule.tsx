import { Button, PadBox } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Divider, Stack, useTheme } from "@mui/material";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { AddHolidayYearDialog } from "./Dialog/AddHolidayYearDialog";
import { HolidayList } from "./HolidayGroupList/HolidayList";
import { useGetHolidayYearsList } from "./HolidayGroupList/Tabs/hooks/useGetHolidayYearsList";
import { Tabs } from "./HolidayGroupList/Tabs/Tabs";

type HolidayRightModuleProps = {
  holidayGroupId: string;
  year: string;
};
export const HolidayRightModule = ({
  holidayGroupId,
  year,
}: HolidayRightModuleProps) => {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddHolidayYearDialog
        open
        onClose={onDialogClose}
        holidayGroupId={holidayGroupId}
      />
    ),
  };

  const { data: holidayYears } = useGetHolidayYearsList({ holidayGroupId });

  return (
    <Stack
      gap="10px"
      sx={{
        bgcolor: lightBlue[50],
        flexGrow: 1,
      }}
    >
      <PadBox padding={{ paddingTop: "10px" }}>
        <Stack>
          <Stack gap="10px" direction="row" alignItems="center">
            {holidayYears && (
              <Tabs
                holidayGroupId={holidayGroupId}
                holidayYears={holidayYears}
              />
            )}
            <Button
              variant="outlined"
              startIcon={<Add />}
              sx={{ height: "38px" }}
              onClick={() => onDialogOpen("add")}
            >
              Add Year
            </Button>
          </Stack>
          <Divider />
        </Stack>
      </PadBox>
      {holidayYears && (
        <HolidayList
          holidayGroupId={holidayGroupId}
          year={year}
          holidayYears={holidayYears}
        />
      )}
      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
