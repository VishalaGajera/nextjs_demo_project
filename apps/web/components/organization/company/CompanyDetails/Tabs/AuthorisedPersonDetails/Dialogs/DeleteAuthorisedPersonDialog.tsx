import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import type { AuthorisedPersonDetails } from "../AuthorisedPersonDetailsCardList/hooks/useGetAuthorisedPersonDetailsCardList";
import { useDeleteAuthorisedPerson } from "./hooks/useDeleteAuthorisedPerson";

type DeleteAuthorisedPersonDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  AuthorisedDetails: AuthorisedPersonDetails;
  companyId: string;
};
export const DeleteAuthorisedPersonDialog = ({
  AuthorisedDetails,
  open,
  onClose,
  onDeleteSuccess,
  companyId,
}: DeleteAuthorisedPersonDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteAuthorisedPerson({
    companyId,
    personId: AuthorisedDetails.id,
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
      title={t("authorised.dialog.delete.message", {
        AuthorisedDetails: AuthorisedDetails.authorised_person_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onClose={() => onClose()}
      onDelete={() => mutate()}
    />
  );
};
