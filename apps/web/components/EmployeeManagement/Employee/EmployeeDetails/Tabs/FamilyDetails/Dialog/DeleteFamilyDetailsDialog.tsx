import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import type { FamilyDetails } from "./hooks/useAddFamilyDetails";
import { useDeleteFamilyDetails } from "./hooks/useDeleteFamilyDetails";

type DeleteFamilyDetailsDialogProps = {
  open: boolean;
  employeeId: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
  familyDetails: FamilyDetails;
};

export const DeleteFamilyDetailsDialog = ({
  familyDetails,
  employeeId,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteFamilyDetailsDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteFamilyDetails({
    employeeId,
    familyId: familyDetails.id,
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
      title={t("family.dialog.delete.message", {
        familyName: familyDetails.name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
