import { Button, Dialog } from "@codezee/sixtify-brahma";
import { GratuityForm } from "../../Dialogs/GratuityForm";
import { useGetGratuityById } from "./Hooks/getGratuityById";

type ViewGratuityDialogProps = {
  open: boolean;
  onClose: () => void;
  gratuityId: string;
};

export const ViewGratuityDialog = ({
  onClose,
  gratuityId,
  open,
}: ViewGratuityDialogProps) => {
  const { data, isPending: loading } = useGetGratuityById({
    gratuityId,
  });

  return (
    <Dialog
      title="View Gratuity"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <GratuityForm defaultValues={data} loading={loading} type="view" />
    </Dialog>
  );
};
