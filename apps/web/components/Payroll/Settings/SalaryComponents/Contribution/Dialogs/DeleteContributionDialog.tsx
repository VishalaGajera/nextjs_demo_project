import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import type { SalaryComponent } from "../../SalaryComponentForm";
import { useDeleteContribution } from "./hooks/useDeleteContribution";

type DeleteContributionDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  contribution: SalaryComponent;
};

export const DeleteContributionDialog = ({
  contribution,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteContributionDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteContribution({
    contributionId: contribution.id,
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
        deleteMessage: `${contribution.contribution_component_name} contribution`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
