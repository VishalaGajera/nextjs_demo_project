import { Button, PadBox } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { AddPastWorkEmploymentDialog } from "./Dialogs/AddPastWorkEmploymentDialog";
import { PastWorkEmploymentList } from "./PastWorkEmploymentList/PastWorkEmploymentList";

type PastWorkEmploymentCardProps = Readonly<{
  employeeId: string;
}>;

export type PastWorkEmploymentListRef = {
  refreshWorkEmploymentList: () => void;
};

export function PastWorkEmploymentCard({
  employeeId,
}: PastWorkEmploymentCardProps) {
  const pastWorkEmploymentListRef = useRef<PastWorkEmploymentListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddPastWorkEmploymentDialog
        employeeId={employeeId}
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          pastWorkEmploymentListRef.current?.refreshWorkEmploymentList()
        }
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
            <Typography variant="subtitle1">Past work Employment</Typography>

            <Stack direction="row" gap="5px">
              <Button variant="outlined" onClick={() => onDialogOpen("add")}>
                <AddRoundedIcon
                  fontSize="small"
                  sx={{ color: butterflyBlue[900] }}
                />

                <Typography variant="body1" sx={{ color: butterflyBlue[900] }}>
                  Add Past Work
                </Typography>
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <PastWorkEmploymentList
          ref={pastWorkEmploymentListRef}
          employeeId={employeeId}
        />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
