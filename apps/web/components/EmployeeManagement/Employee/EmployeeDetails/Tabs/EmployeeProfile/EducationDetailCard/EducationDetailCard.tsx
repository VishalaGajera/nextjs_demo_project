import { Button, PadBox } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { AddEducationDialog } from "./Dialogs/AddEducationDialog";
import { EducationDetailList } from "./EducationDetailList/EducationDetailList";

type EducationDetailsProps = Readonly<{
  employeeId: string;
}>;

export type EducationDetailsRef = {
  refreshEducationDetailList: () => void;
};

export function EducationDetailCard({ employeeId }: EducationDetailsProps) {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const educationDetailsRef = useRef<EducationDetailsRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddEducationDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          educationDetailsRef.current?.refreshEducationDetailList()
        }
        employeeId={employeeId}
      />
    ),
  };

  return (
    <>
      <Box
        sx={{
          background: iron[600],
          border: `1px solid ${butterflyBlue[300]}`,
          borderRadius: "6px",
          height: "100%",
          width: "100%",
        }}
      >
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">Education Details</Typography>

            <Stack direction="row" gap="5px">
              <Button variant="outlined" onClick={() => onDialogOpen("add")}>
                <AddRoundedIcon
                  fontSize="small"
                  sx={{ color: butterflyBlue[900] }}
                />

                <Typography variant="body1" sx={{ color: butterflyBlue[900] }}>
                  Add Education
                </Typography>
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <EducationDetailList
          ref={educationDetailsRef}
          employeeId={employeeId}
        />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
