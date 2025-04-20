import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../utils/errors";
import type { Company } from "../CompanyList/hooks/useGetCompanies";
import { useDeleteCompany } from "./hooks/useDeleteCompany";

type DeleteCompanyDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  company: Company;
};

export const DeleteCompanyDialog = ({
  company,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteCompanyDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteCompany({
    companyId: company.id,
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
      title={t("company.dialog.delete.message", {
        companyName: company.company_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
