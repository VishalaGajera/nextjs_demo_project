import { BottomDialog, toasts } from "@codezee/sixtify-brahma";
import { InActiveBottomDialogBody } from "../../common/InActiveBottomDialogBody";
import { useEditDesignation } from "./hooks/useEditDesignation";

type InActiveDesignationDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  designationId: string;
  designationName: string;
};

export const InActiveDesignationDialog = ({
  designationId,
  open,
  onClose,
  designationName,
  onSuccess,
}: InActiveDesignationDialogProps) => {
  const { mutate } = useEditDesignation({
    designationId,
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
      title={`Inactive ${designationName} Designation`}
    >
      <InActiveBottomDialogBody
        sectionId={designationId}
        section="designation"
        alertKey="Designation"
        onInActive={() => mutate({ is_active: false })}
      />
    </BottomDialog>
  );
};
