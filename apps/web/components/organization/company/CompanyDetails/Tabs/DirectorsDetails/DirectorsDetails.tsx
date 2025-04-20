import { Button, PadBox } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, useTheme } from "@mui/material";
import { useRef } from "react";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { DirectorDetailsCard } from "../DirectorsDetails/DirectorDetailsCard/DirectorsDetailsCard";
import { AddDirectorDetailDialog } from "./Dialogs/AddDirectorDetailDialog";

type DirectorDetailsProps = {
  companyId: string;
};

export type DirectorDetailsRef = {
  refreshDirectorDetailsList: () => void;
};

export const DirectorDetails = ({ companyId }: DirectorDetailsProps) => {
  const directorDetailsRef = useRef<DirectorDetailsRef>(null);

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddDirectorDetailDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          directorDetailsRef.current?.refreshDirectorDetailsList()
        }
        companyId={companyId}
      />
    ),
  };

  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  return (
    <Stack>
      <Box bgcolor={iron[600]}>
        <PadBox
          padding={{
            padding: "10px",
          }}
        >
          <Stack flexDirection="row" justifyContent="flex-end">
            <Button
              variant="outlined"
              sx={{ width: "210px" }}
              onClick={() => onDialogOpen("add")}
            >
              <AddRoundedIcon fontSize="small" />
              Add Director
            </Button>
          </Stack>
        </PadBox>
      </Box>

      <DirectorDetailsCard companyId={companyId} ref={directorDetailsRef} />
      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
