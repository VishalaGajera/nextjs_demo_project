import { BottomDialog, toasts } from "@codezee/sixtify-brahma";
import { InActiveBottomDialogBody } from "../../common/InActiveBottomDialogBody";
import { useEditSubDepartment } from "./hooks/useEditSubDepartment";

type InActiveSubDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subDepartmentId: string;
  subDepartmentName: string;
};

export const InActiveSubDepartmentDialog = ({
  subDepartmentId,
  subDepartmentName,
  open,
  onClose,
  onSuccess,
}: InActiveSubDepartmentDialogProps) => {
  const { mutate } = useEditSubDepartment({
    subDepartmentId,
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
      title={`Inactive ${subDepartmentName} Sub Department`}
    >
      <InActiveBottomDialogBody
        sectionId={subDepartmentId}
        section="sub_department"
        alertKey="Grade"
        onInActive={() => mutate({ is_active: false })}
      />
    </BottomDialog>
  );
};
