import { BottomDialog, toasts } from "@codezee/sixtify-brahma";
import { InActiveBottomDialogBody } from "../../common/InActiveBottomDialogBody";
import { useEditDepartment } from "./hooks/useEditDepartment";

type InActiveDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departmentId: string;
  departmentName: string;
};

export const InActiveDepartmentDialog = ({
  departmentId,
  departmentName,
  open,
  onClose,
  onSuccess,
}: InActiveDepartmentDialogProps) => {
  const { mutate } = useEditDepartment({
    departmentId,
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
      title={`Inactive ${departmentName} Department`}
    >
      <InActiveBottomDialogBody
        sectionId={departmentId}
        section="department"
        alertKey="Department"
        onInActive={() => mutate({ is_active: false })}
      />
    </BottomDialog>
  );
};
