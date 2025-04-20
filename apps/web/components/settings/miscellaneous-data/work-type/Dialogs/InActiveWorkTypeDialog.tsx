import { BottomDialog, toasts } from "@codezee/sixtify-brahma";
import { InActiveBottomDialogBody } from "../../common/InActiveBottomDialogBody";
import { useEditWorkType } from "./hooks/useEditWorkType";

type InActiveWorkTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workTypeId: string;
  workTypeName: string;
};

export const InActiveWorkTypeDialog = ({
  workTypeId,
  workTypeName,
  open,
  onClose,
  onSuccess,
}: InActiveWorkTypeDialogProps) => {
  const { mutate } = useEditWorkType({
    workTypeId,
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
      title={`Inactive ${workTypeName} Work Type`}
    >
      <InActiveBottomDialogBody
        sectionId={workTypeId}
        section="work_type"
        alertKey="Work type"
        onInActive={() => mutate({ is_active: false })}
      />
    </BottomDialog>
  );
};
