import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { AdvanceAndReceive } from "../AdvanceAndReceiveList/hooks/useGetAdvanceAndReceiveList";
import { useDeleteAdvanceAndReceive } from "./hooks/useDeleteAdvanceAndReceive";

type DeleteAdvanceAndReceiveDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  advanceAndReceive: AdvanceAndReceive;
};

export const DeleteAdvanceAndReceiveDialog = ({
  advanceAndReceive,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteAdvanceAndReceiveDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteAdvanceAndReceive({
    advanceAndReceiveId: advanceAndReceive.id,
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
        deleteMessage: `${advanceAndReceive.employee_name} advance & receive`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
