import { Button, Dialog } from "@codezee/sixtify-brahma";
import { AddAdvanceAndReceiveForm } from "./AddAdvanceAndReceiveForm";
import { useGetAdvanceAndReceive } from "./hooks/useGetAdvanceAndReceive";

type ViewAdvanceAndReceiveDialogProps = {
  open: boolean;
  onClose: () => void;
  advanceAndReceiveId: string;
};

export const ViewAdvanceAndReceiveDialog = ({
  open,
  onClose,
  advanceAndReceiveId,
}: ViewAdvanceAndReceiveDialogProps) => {
  const {
    data: advanceAndReceiveData,
    isPending: isPendingAdvanceAndReceiveData,
  } = useGetAdvanceAndReceive({
    advanceAndReceiveId,
  });

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View Advance & Receive"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <AddAdvanceAndReceiveForm
        isView
        defaultValues={advanceAndReceiveData}
        loading={isPendingAdvanceAndReceiveData}
      />
    </Dialog>
  );
};
