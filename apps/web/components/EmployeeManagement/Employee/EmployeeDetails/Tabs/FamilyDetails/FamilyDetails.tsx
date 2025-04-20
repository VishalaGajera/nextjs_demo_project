import { Button, PadBox } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { AddFamilyDetailsDialog } from "./Dialog/AddFamilyDetailsDialog";
import { FamilyDetailsList } from "./FamilyDetailsList/FamilyDetailsList";

type FamilyDetailsProps = {
  employeeId: string;
};
export type FamilyDetailsListRef = {
  refreshFamilyDetailsList: () => void;
};

export const FamilyDetails = ({ employeeId }: FamilyDetailsProps) => {
  const familyDetailsListRef = useRef<FamilyDetailsListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddFamilyDetailsDialog
        onClose={onDialogClose}
        open
        employeeId={employeeId}
        onAddSuccess={() =>
          familyDetailsListRef.current?.refreshFamilyDetailsList()
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
            <Typography variant="subtitle1">Family Details</Typography>

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => onDialogOpen("add")}
            >
              Add Family
            </Button>
          </Stack>
        </PadBox>

        <FamilyDetailsList ref={familyDetailsListRef} employeeId={employeeId} />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
