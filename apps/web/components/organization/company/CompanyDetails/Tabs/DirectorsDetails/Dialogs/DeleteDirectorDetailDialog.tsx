import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import type { DirectorDetails } from "../DirectorDetailsCard/hooks/useGetDirectorsDetails";
import { useDeleteDirectorDetail } from "./hooks/useDeleteDirectorDetails";

type DeleteDirectorDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  directorDetail: DirectorDetails;
  companyId: string;
};
export const DeleteDirectorDetailDialog = ({
  directorDetail,
  open,
  onClose,
  onDeleteSuccess,
  companyId,
}: DeleteDirectorDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteDirectorDetail({
    companyId,
    directorDetailId: directorDetail.id,
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
      title={t("director.dialog.delete.message", {
        directorName: directorDetail.director_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onClose={() => onClose()}
      onDelete={() => mutate()}
    />
  );
};
