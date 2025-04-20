import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { SubDepartment } from "../SubDepartmentList/hooks/useGetSubDepartments";
import { useGetSubDepartment } from "./hooks/useGetSubDepartment";
import { SubDepartmentForm } from "./SubDepartmentForm";

type ViewSubDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  subDepartmentId: SubDepartment["id"];
};

export const ViewSubDepartmentDialog = ({
  subDepartmentId,
  open,
  onClose,
}: ViewSubDepartmentDialogProps) => {
  const { data: subDepartment, isPending: isPendingSubDepartmentData } =
    useGetSubDepartment({
      subDepartmentId,
    });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Sub Department"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <SubDepartmentForm
        defaultValues={subDepartment}
        isLoading={isPendingSubDepartmentData}
        disabled
      />
    </Dialog>
  );
};
