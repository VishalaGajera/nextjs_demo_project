import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../utils/errors";
import type { CompanyBank } from "../CompanyBankList/hooks/useGetCompanyBanks";
import { useDeleteCompanyBank } from "./hooks/useDeleteCompanyBank";

type DeleteCompanyBankDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  companyBank: CompanyBank;
};

export const DeleteCompanyBankDialog = ({
  companyBank,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteCompanyBankDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteCompanyBank({
    companyBankId: companyBank.id,
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
      title={t("companyBank.dialog.delete.message", {
        companyBankName: companyBank.bank_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
