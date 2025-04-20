import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import type { BankShiftDetail } from "../BankShiftList/hooks/useGetBankShiftList";
import { useDeleteBankShift } from "./hooks/useDeleteBankShift";

type DeleteBankShiftDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  bankShiftType: BankShiftDetail;
};

export const DeleteBankShiftDialog = ({
  bankShiftType,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteBankShiftDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteBankShift({
    bankShiftTypeId: bankShiftType.id,
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
      title={t("bankshiftType.dialog.delete.message", {
        bankShiftTypeName: bankShiftType.bank_shift_type_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
