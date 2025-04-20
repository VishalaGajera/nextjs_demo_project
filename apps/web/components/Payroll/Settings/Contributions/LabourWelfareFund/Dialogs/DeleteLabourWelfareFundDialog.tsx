import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import type { LabourWelfareFund } from "../LabourWelfareFundListing/hooks/useListLabourWelfareFund";
import { useDeleteLabourWelfareFund } from "./hooks/useDeleteLabourWelfareFund";

type DeleteLabourWelfareFundDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  labourWelfareFund: LabourWelfareFund;
};

export const DeleteLabourWelfareFundDialog = ({
  open,
  onDeleteSuccess,
  onClose,
  labourWelfareFund,
}: DeleteLabourWelfareFundDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteLabourWelfareFund({
    lwfGroupId: labourWelfareFund.id,
    options: {
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  return (
    <DeleteDialog
      title={t("lwfGroup.dialog.delete.message", {
        lwfGroupName: labourWelfareFund.state_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
