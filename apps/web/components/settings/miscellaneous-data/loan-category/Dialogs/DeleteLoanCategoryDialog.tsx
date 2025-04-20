import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { LoanCategory } from "../LoanCategory/hooks/useGetLoanCategories";
import { useDeleteLoanCategory } from "./hooks/useDeleteLoanCategory";

type DeleteLoanCategoryDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  loanCategory: LoanCategory;
};

export const DeleteLoanCategoryDialog = ({
  loanCategory,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteLoanCategoryDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteLoanCategory({
    loanCategoryId: loanCategory.id,
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
        deleteMessage: `${loanCategory.loan_category_name} loan category`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
