import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../utils/errors";
import type { BankShiftPattern } from "../BankShiftPatternList/hooks/useGetBankShiftPatterns";
import { useDeleteBankShiftPattern } from "./hooks/useDeleteBankShiftPattern";

type DeleteBankShiftPatternDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  bankShiftPattern: BankShiftPattern;
};

export const DeleteBankShiftPatternDialog = ({
  bankShiftPattern,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteBankShiftPatternDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteBankShiftPattern({
    bankShiftPatternId: bankShiftPattern.id,
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
        deleteMessage: `${bankShiftPattern.bank_shift_pattern_name}  Bank Shift Pattern`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
