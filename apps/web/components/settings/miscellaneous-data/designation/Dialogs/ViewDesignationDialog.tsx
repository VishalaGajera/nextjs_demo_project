import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { Designation } from "../DesignationList/hooks/useDesignations";
import { DesignationForm } from "./DesignationForm";
import { useGetDesignation } from "./hooks/useGetDesignation";

type ViewDesignationDialogProps = {
  open: boolean;
  onClose: () => void;
  designationId: Designation["id"];
};

export const ViewDesignationDialog = ({
  designationId,
  open,
  onClose,
}: ViewDesignationDialogProps) => {
  const { data: designation, isPending: isPendingLatestDesignationData } =
    useGetDesignation({
      designationId,
    });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Designation"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <DesignationForm
        defaultValues={designation}
        loading={isPendingLatestDesignationData}
        disabled
      />
    </Dialog>
  );
};
