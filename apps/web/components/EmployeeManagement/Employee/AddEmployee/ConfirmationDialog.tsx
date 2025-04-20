import { Button, Dialog } from "@codezee/sixtify-brahma";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export type ConfirmationDialogProps = {
  open: boolean;
  onSave: () => void;
  onClose: () => void;
};

export const ConfirmationDialog = ({
  open,
  onSave,
  onClose,
}: ConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="xs"
      isHideCloseIcon
      isHideDividers={true}
      open={open}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            No
          </Button>

          <Button onClick={onSave} color="error">
            Yes
          </Button>
        </Stack>
      }
    >
      <Stack gap="10px" direction="row">
        <InfoTwoToneIcon color="error" sx={{ mt: "1px" }} />

        <Typography variant="subtitle1" fontWeight={700}>
          {t("employee.dialog.cancel.message")}
        </Typography>
      </Stack>
    </Dialog>
  );
};
