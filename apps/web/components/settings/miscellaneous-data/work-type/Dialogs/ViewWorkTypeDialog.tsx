import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { WorkType } from "../WorkTypeList/hooks/useGetWorkTypes";
import { WorkTypeForm } from "./WorkTypeForm";
import { useGetWorkType } from "./hooks/useGetWorkType";

type ViewWorkTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  workTypeId: WorkType["id"];
};

export const ViewWorkTypeDialog = ({
  workTypeId,
  open,
  onClose,
}: ViewWorkTypeDialogProps) => {
  const { data: workType, isPending: isPendingWorkTypeData } = useGetWorkType({
    workTypeId,
  });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Work Type"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <WorkTypeForm
        defaultValues={workType}
        loading={isPendingWorkTypeData}
        disabled
      />
    </Dialog>
  );
};
