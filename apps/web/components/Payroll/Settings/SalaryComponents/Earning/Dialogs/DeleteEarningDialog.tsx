import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import type { Earning } from "../EarningList/hooks/useGetEarnings";
import { useDeleteEarning } from "./hooks/useDeleteEarning";

type DeleteEarningDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  earningData: Earning;
};

export const DeleteEarningDialog = ({
  earningData,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteEarningDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteEarning({
    earningId: earningData.id,
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
        deleteMessage: `${earningData.earning_component_name} earning`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
