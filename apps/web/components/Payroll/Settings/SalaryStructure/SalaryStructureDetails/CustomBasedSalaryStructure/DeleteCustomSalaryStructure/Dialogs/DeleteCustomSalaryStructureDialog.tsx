import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../../utils/errors";
import type { CustomSalaryStructureType } from "../../../RangeBasedSalaryStructure/List/CustomBasedSalaryStructureList/Hooks/useGetCustomBasedSalaryStructureList";
import { useCustomDeleteSalaryStructure } from "../Hooks/useDeleteCustomSalaryStructure";

type DeleteCustomSalaryStructureDialogProps = {
  open: boolean;
  ssId: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
  customSalaryStructureData: CustomSalaryStructureType;
};

export const DeleteCustomSalaryStructureDialog = ({
  customSalaryStructureData,
  open,
  onDeleteSuccess,
  onClose,
  ssId,
}: DeleteCustomSalaryStructureDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useCustomDeleteSalaryStructure({
    ssId,
    csId: customSalaryStructureData.id,
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
        deleteMessage: `${customSalaryStructureData.salary_structure_name} Custom Salary Structure`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
