import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { Designation } from "../DesignationList/hooks/useDesignations";
import { useDeleteDesignation } from "./hooks/useDeleteDesignation";

type DeleteDesignationDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  designation: Designation;
};

export const DeleteDesignationDialog = ({
  designation,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteDesignationDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteDesignation({
    designationId: designation.id,
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
      title={t("designation.dialog.delete.message", {
        designationName: designation.designation_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
