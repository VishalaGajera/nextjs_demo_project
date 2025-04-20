import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import type { SalaryComponent } from "../../SalaryComponentForm";
import { useDeleteReimbursement } from "./hooks/useDeleteReimbursement";

type DeleteReimbursementDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  reimbursement: SalaryComponent;
};

export const DeleteReimbursementDialog = ({
  reimbursement,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteReimbursementDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteReimbursement({
    reimbursementId: reimbursement.id,
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
      title={t("dialog.delete.message", {
        deleteMessage: `${reimbursement.reimbursement_component_name} reimbursement`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
