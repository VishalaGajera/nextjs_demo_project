import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import type { SalaryComponent } from "../../SalaryComponentForm";
import { useDeleteDeduction } from "./hooks/useDeleteDeduction";

type DeleteDeductionDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  deduction: SalaryComponent;
};

export const DeleteDeductionDialog = ({
  deduction,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteDeductionDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteDeduction({
    deductionId: deduction.id,
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
        deleteMessage: `${deduction.deduction_component_name} deduction`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
