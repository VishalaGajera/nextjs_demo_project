import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import type { ESICRecord } from "../ESICList/hooks/useGetESICList";
import { useDeleteESIC } from "./hooks/useDeleteESIC";

type DeleteESICDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  esicData: ESICRecord;
};

export const DeleteESICDialog = ({
  esicData,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteESICDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteESIC({
    esicId: esicData.id,
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
      title={t("esic.dialog.delete.message", {
        esicName: esicData.esic_group_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
