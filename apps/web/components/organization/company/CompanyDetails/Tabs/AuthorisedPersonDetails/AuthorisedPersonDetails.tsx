import { Button, PadBox } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { PageProps } from "../../../../../../app/organization/company/[companyId]/page";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import { authorisedPersonDetailsKey } from "../../../../../../queryKeysFactories/authorisedPersonDetails";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { AuthorisedPersonDetailsCardList } from "./AuthorisedPersonDetailsCardList/AuthorisedPersonDetailsCardList";
import { AddAuthorisedPersonDialog } from "./Dialogs/AddAuthorisedPersonDialog";
type AuthorisedPersonDetailsProps = Readonly<PageProps["params"]>;

export function AuthorisedPersonDetails({
  companyId,
}: AuthorisedPersonDetailsProps) {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddAuthorisedPersonDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: authorisedPersonDetailsKey.listing(companyId),
          });
        }}
        companyId={companyId}
      />
    ),
  };

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
              sx={{ width: "230px" }}
              onClick={() => onDialogOpen("add")}
            >
              <AddRoundedIcon fontSize="small" />
              Add Authorised Person
            </Button>
          </Stack>
        </PadBox>
      </Box>
      <AuthorisedPersonDetailsCardList companyId={companyId} />
      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
