import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import type { InvestmentSchemesRecord } from "../InvestmentSchemesList/hooks/useGetInvestmentSchemesList";
import { useDeleteInvestmentSchemes } from "./hooks/useDeleteInvestmentSchemes";

type DeleteInvestmentSchemesDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  investmentSchemesData: InvestmentSchemesRecord;
};

export const DeleteInvestmentSchemesDialog = ({
  investmentSchemesData,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteInvestmentSchemesDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteInvestmentSchemes({
    investmentSchemesId: investmentSchemesData.id,
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
      title={t("dialog.delete.message", {
        deleteMessage: investmentSchemesData.scheme_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
