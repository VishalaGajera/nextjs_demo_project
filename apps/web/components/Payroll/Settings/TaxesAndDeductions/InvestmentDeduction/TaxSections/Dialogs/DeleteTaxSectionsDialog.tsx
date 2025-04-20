import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import type { TaxSectionsRecord } from "../TaxSectionsList/hooks/useGetTaxSectionsList";
import { useDeleteTaxSections } from "./hooks/useDeleteTaxSections";

type DeleteTaxSectionsDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  taxSectionsData: TaxSectionsRecord;
};

export const DeleteTaxSectionsDialog = ({
  taxSectionsData,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteTaxSectionsDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteTaxSections({
    taxSectionsId: taxSectionsData.id,
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
        deleteMessage: `${taxSectionsData.section_code} Tax Section`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
