import { Button, Dialog } from "@codezee/sixtify-brahma";
import { LabourWelfareFundForm } from "../LabourWelfareFundForm/LabourWelfareFundForm";
import { useGetLabourWelfareFund } from "./hooks/useGetLabourWelfareFund";

type ViewLabourWelfareFundDialogProps = {
  open: boolean;
  onClose: () => void;
  lwfGroupId: string;
};

export const ViewLabourWelfareFundDialog = ({
  lwfGroupId,
  open,
  onClose,
}: ViewLabourWelfareFundDialogProps) => {
  const { data, isPending } = useGetLabourWelfareFund({
    lwfGroupId,
  });

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View Labour Welfare Fund"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <LabourWelfareFundForm
        type="view"
        defaultValues={data}
        loading={isPending}
      />
    </Dialog>
  );
};
