import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { onError } from "../../../../../../../../utils/errors";
import { type GratuityInfo } from "./Hooks/getGratuityById";
import { useDeleteGratuity } from "./Hooks/useDeleteGratuity";

type DeleteGratuityDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  gratuity: GratuityInfo;
};

export const DeleteGratuityDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  gratuity,
}: DeleteGratuityDialogProps) => {
  const { mutate, isPending } = useDeleteGratuity({
    gratuityId: gratuity.id,
    options: {
      onSuccess: (success) => {
        onDeleteSuccess();

        onClose();

        toasts.success({
          title: success.message,
        });
      },
      onError: (error) => onError(error),
    },
  });

  return (
    <DeleteDialog
      title={t("gratuity.dialog.delete.message", {
        gratuityName: gratuity.company_name,
      })}
      open={open}
      onClose={onClose}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
    />
  );
};
