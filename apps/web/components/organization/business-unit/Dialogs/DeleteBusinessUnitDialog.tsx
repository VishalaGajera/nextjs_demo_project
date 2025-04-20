import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../utils/errors";
import type { BusinessUnit } from "../BusinessUnitList/hooks/useGetBusinessUnitss";
import { useDeleteBusinessUnit } from "./hooks/useDeleteBusinessUnit";

type DeleteBusinessUnitDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  businessUnit: BusinessUnit;
};

export const DeleteBusinessUnitDialog = ({
  businessUnit,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteBusinessUnitDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteBusinessUnit({
    businessUnitId: businessUnit.id,
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
      title={t("businessUnit.dialog.delete.message", {
        businessUnitName: businessUnit.business_unit_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
