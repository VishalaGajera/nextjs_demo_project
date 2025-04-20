import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";

type ViewImportLogDialogProps = {
  open: boolean;
  onClose: () => void;
  logStatus: string;
};

export const ViewImportLogDialog = ({
  logStatus,
  open,
  onClose,
}: ViewImportLogDialogProps) => {
  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Log Status"
      actions={
        <Button onClick={onClose} variant="outlined">
          Ok
        </Button>
      }
    >
      <Stack gap="10px">
        <Typography textAlign="center" variant="body1">
          Started processing the excel file...
        </Typography>

        <Typography textAlign="center" variant="body1">
          {logStatus}
        </Typography>

        <Typography textAlign="center" variant="body1">
          Importing data from the Excel File Uploaded SuccessFully.
        </Typography>
      </Stack>
    </Dialog>
  );
};
