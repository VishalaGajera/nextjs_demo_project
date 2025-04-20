import { Button, PadBox } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { AddMapLeavePlanTypeDialog } from "./Dialog/AddMapLeavePlanTypeDialog";
import { LeavePlanTypeList } from "./LeavePlanTypeList/LeavePlanTypeList";

type LeavePlanTypeProps = {
  leavePlanId: string;
  selectedLeavePlanTitle?: string;
};

export type MapLeavePlanTypeListRef = {
  refreshMapLeavePlanType: () => void;
};

export const LeavePlanType = ({
  leavePlanId,
  selectedLeavePlanTitle,
}: LeavePlanTypeProps) => {
  const theme = useTheme();

  const mapLeavePlanTypeListRef = useRef<MapLeavePlanTypeListRef>(null);

  const { lightBlue } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddMapLeavePlanTypeDialog
        open
        onClose={onDialogClose}
        leavePlanId={leavePlanId}
        onAddSuccess={() =>
          mapLeavePlanTypeListRef.current?.refreshMapLeavePlanType()
        }
      />
    ),
  };

  return (
    <Stack
      gap="10px"
      sx={{
        bgcolor: lightBlue[50],
        flexGrow: 1,
      }}
    >
      <PadBox padding={{ padding: "10px" }}>
        <Stack
          gap="10px"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{selectedLeavePlanTitle}</Typography>

          <Button
            variant="outlined"
            startIcon={<Add />}
            sx={{ height: "38px" }}
            onClick={() => onDialogOpen("add")}
          >
            Map Leave Type To Plan
          </Button>
        </Stack>
      </PadBox>

      <LeavePlanTypeList
        leavePlanId={leavePlanId}
        ref={mapLeavePlanTypeListRef}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
