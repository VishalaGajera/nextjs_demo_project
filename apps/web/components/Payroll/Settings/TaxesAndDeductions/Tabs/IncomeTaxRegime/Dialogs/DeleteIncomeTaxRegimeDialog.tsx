import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import { useDeleteIncomeTaxRegime } from "../hooks/useDeleteIncomeTaxRegime";
import type { IncomeTaxRegimes } from "../IncomeTaxRegimeList/hooks/useGeIncomeTaxRegimeList";

type DeleteIncomeTaxRegimeDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  incomeTaxRegime: IncomeTaxRegimes;
};

export const DeleteIncomeTaxRegimeDialog = ({
  incomeTaxRegime,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteIncomeTaxRegimeDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteIncomeTaxRegime({
    incomeTaxRegimeId: incomeTaxRegime.id,
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
        deleteMessage: `${incomeTaxRegime.regime_type} Income Tax Regime`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
