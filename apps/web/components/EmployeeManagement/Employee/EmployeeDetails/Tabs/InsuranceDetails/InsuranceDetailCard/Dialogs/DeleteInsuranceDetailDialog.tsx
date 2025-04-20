import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../../utils/errors";
import type { InsuranceDetail } from "../InsuranceDetailList/hooks/useGetInsuranceDetail";
import { useDeleteInsuranceDetail } from "./hooks/useDeleteInsuranceDetail";

type DeleteEducationDialogProps = {
  open: boolean;
  employeeId: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
  insuranceDetail: InsuranceDetail;
};
export const DeleteInsuranceDetailDialog = ({
  insuranceDetail,
  open,
  onClose,
  employeeId,
  onDeleteSuccess,
}: DeleteEducationDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteInsuranceDetail({
    employeeId,
    insuranceDetailId: insuranceDetail.id,
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
      title={t("insurance.dialog.delete.message", {
        educationName: insuranceDetail.insurance_provider,
      })}
      open={open}
      isDeleteLoading={isPending}
      onClose={() => onClose()}
      onDelete={() => mutate()}
    />
  );
};
