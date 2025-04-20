import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import type { SalaryStructure } from "../../SalaryStructureList/Hooks/useGetSalaryStructureList";
import { useDeleteSalaryStructure } from "../Hooks/useDeleteSalaryStructure";

type DeleteSalaryStructureDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  salaryStructure: SalaryStructure;
};

export const DeleteSalaryStructureDialog = ({
  salaryStructure,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteSalaryStructureDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteSalaryStructure({
    ssId: salaryStructure.id,
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
        deleteMessage: `${salaryStructure.salary_structure_name} Salary Structure`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
