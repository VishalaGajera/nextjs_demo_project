import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { LoanListType } from "../LoanList/hooks/useGetLoanList";
import { useDeleteLoan } from "./hooks/useDeleteLoan";

type DeleteLoanDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  loan: LoanListType;
};

export const DeleteLoanDialog = ({
  loan,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteLoanDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteLoan({
    loanId: loan.id,
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
        deleteMessage: `${loan.employee_name}'s loan`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
