import { BottomDialog, toasts } from "@codezee/sixtify-brahma";
import { InActiveBottomDialogBody } from "../../common/InActiveBottomDialogBody";
import { useEditGrade } from "./hooks/useEditGrade";

type InActiveGradeDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gradeId: string;
  gradeName: string;
};

export const InActiveGradeDialog = ({
  gradeId,
  gradeName,
  open,
  onClose,
  onSuccess,
}: InActiveGradeDialogProps) => {
  const { mutate } = useEditGrade({
    gradeId,
    options: {
      onSuccess: ({ message }) => {
        onClose();
        onSuccess();
        toasts.success({ title: message });
      },
    },
  });

  return (
    <BottomDialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={`Inactive ${gradeName} Grade`}
    >
      <InActiveBottomDialogBody
        sectionId={gradeId}
        section="grade"
        alertKey="Grade"
        onInActive={() => mutate({ is_active: false })}
      />
    </BottomDialog>
  );
};
