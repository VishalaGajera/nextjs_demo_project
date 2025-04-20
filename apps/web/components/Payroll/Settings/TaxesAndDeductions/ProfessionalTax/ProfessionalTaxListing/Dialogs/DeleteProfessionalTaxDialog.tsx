import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import { type PtGroupType } from "../Hooks/useGetProfessionalTaxList";
import { useDeleteProfessionalTax } from "./Hooks/useDeleteProfessionalTax";

type DeleteProfessionalTaxDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  PtGroup: PtGroupType;
};

export const DeleteProfessionalTaxDialog = ({
  PtGroup,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteProfessionalTaxDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteProfessionalTax({
    prfessionalTaxId: PtGroup.id,
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
        deleteMessage: `${PtGroup.state_name} Professional Tax group?`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
