import { Button, Dialog } from "@codezee/sixtify-brahma";
import { ESICForm } from "./ESICForm";
import { useGetESIC } from "./hooks/useGetESIC";

type ViewESICDialogProps = {
  open: boolean;
  onClose: () => void;
  esicId: string;
};

export const ViewESICDialog = ({
  open,
  onClose,
  esicId,
}: ViewESICDialogProps) => {
  const { data: esicData, isPending: isPendingESICData } = useGetESIC({
    esicId,
  });

  return (
    <Dialog
      title="View ESIC"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <ESICForm
        defaultValues={esicData}
        loading={isPendingESICData}
        dialogType="view"
      />
    </Dialog>
  );
};
