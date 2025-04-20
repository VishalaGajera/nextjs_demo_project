import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../../utils/errors";
import type { QualificationOptionsKey } from "../../../../../../../common/Autocomplete/hooks/useGetQualificationOptions";
import { QualificationOptions } from "../../../../../../../common/Autocomplete/hooks/useGetQualificationOptions";
import type { EducationDetails } from "../EducationDetailList/hooks/useGetEducationDetails";
import { useDeleteEducation } from "./hooks/useDeleteEducation";

type DeleteEducationDialogProps = {
  open: boolean;
  employeeId: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
  educationDetails: EducationDetails;
};
export const DeleteEducationDialog = ({
  educationDetails,
  open,
  onClose,
  employeeId,
  onDeleteSuccess,
}: DeleteEducationDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteEducation({
    educationId: educationDetails.id,
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const qualification =
    QualificationOptions[
      educationDetails.qualification as QualificationOptionsKey
    ];

  return (
    <DeleteDialog
      title={t("education.dialog.delete.message", {
        educationName: qualification,
      })}
      open={open}
      isDeleteLoading={isPending}
      onClose={() => onClose()}
      onDelete={() => mutate()}
    />
  );
};
