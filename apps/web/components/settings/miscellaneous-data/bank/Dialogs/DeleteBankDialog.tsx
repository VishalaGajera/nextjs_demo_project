import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { Bank } from "../BankList/hooks/useGetBanks";
import { useDeleteBank } from "./hooks/useDeleteBank";

type DeleteBankDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  bank: Bank;
};

export const DeleteBankDialog = ({
  bank,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteBankDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteBank({
    bankId: bank.id,
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
      title={t("bank.dialog.delete.message", {
        bankName: bank.bank_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
