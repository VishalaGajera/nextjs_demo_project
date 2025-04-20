import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { Department } from "../DepartmentList/hooks/useGetDepartments";
import { DepartmentForm } from "./DepartmentForm";
import { useGetDepartment } from "./hooks/useGetDepartment";

type ViewDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  departmentId: Department["id"];
};

export const ViewDepartmentDialog = ({
  departmentId,
  open,
  onClose,
}: ViewDepartmentDialogProps) => {
  const {
    data: latestDepartmentData,
    isPending: isPendingLatestDepartmentData,
  } = useGetDepartment({
    departmentId,
  });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Department"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <DepartmentForm
        defaultValues={latestDepartmentData}
        loading={isPendingLatestDepartmentData}
        disabled
      />
    </Dialog>
  );
};
