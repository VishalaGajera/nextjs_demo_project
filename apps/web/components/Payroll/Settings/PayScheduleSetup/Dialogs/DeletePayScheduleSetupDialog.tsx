import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { PayScheduleSetup } from "../PayScheduleSetupList/hooks/useGetPayScheduleSetupList";
import { useDeletePayScheduleSetup } from "./hooks/useDeletePayScheduleSetup";

type DeletePayScheduleSetupDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  payScheduleSetup: PayScheduleSetup;
};

export const DeletePayScheduleSetupDialog = ({
  payScheduleSetup,
  open,
  onDeleteSuccess,
  onClose,
}: DeletePayScheduleSetupDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeletePayScheduleSetup({
    payScheduleSetupId: payScheduleSetup.id,
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
      title={t("payScheduleSetup.dialog.delete.message", {
        payScheduleSetupName: payScheduleSetup.pay_schedule_group_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
