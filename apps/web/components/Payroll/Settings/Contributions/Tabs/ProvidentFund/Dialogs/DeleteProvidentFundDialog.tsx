import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import type { ProvidentFundRecord } from "../ProvidentFundList/hooks/useGetProvidentFundList";
import { useDeleteProvidentFund } from "./hooks/useDeleteProvidentFund";

type DeleteProvidentFundDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  providentFundData: ProvidentFundRecord;
};

export const DeleteProvidentFundDialog = ({
  providentFundData,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteProvidentFundDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteProvidentFund({
    providentFundId: providentFundData.id,
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
      title={t("providentFund.dialog.delete.message", {
        providentFundName: providentFundData.epf_group_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
