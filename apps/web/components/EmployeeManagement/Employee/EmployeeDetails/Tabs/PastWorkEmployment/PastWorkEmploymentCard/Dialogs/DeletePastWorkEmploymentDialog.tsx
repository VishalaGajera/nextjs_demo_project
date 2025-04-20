import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { onError } from "../../../../../../../../utils/errors";
import type { PastWorkEmployment } from "../PastWorkEmploymentList/hooks/useGetPastWorkEmployments";
import { useDeletePastWorkEmployment } from "./hooks/useDeletePastWorkEmployment";

type DeletePastWorkEmploymentDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  pastWorkEmployment: PastWorkEmployment;
  employeeId: string;
};

export const DeletePastWorkEmploymentDialog = ({
  pastWorkEmployment,
  open,
  onDeleteSuccess,
  onClose,
  employeeId,
}: DeletePastWorkEmploymentDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeletePastWorkEmployment({
    employeeId,
    pastWorkEmploymentId: pastWorkEmployment.id,
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
      title={t("pastWorkEmployment.dialog.delete.message", {
        companyName: pastWorkEmployment.company_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
