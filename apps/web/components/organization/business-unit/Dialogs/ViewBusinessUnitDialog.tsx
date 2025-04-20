import { Button, Dialog } from "@codezee/sixtify-brahma";
import { BusinessUnitForm } from "./BusinessUnitForm";
import { useGetBusinessUnit } from "./hooks/useGetBusinessUnit";

type ViewBusinessUnitDialogProps = {
  open: boolean;
  onClose: () => void;
  businessUnitId: string;
};

export const ViewBusinessUnitDialog = ({
  businessUnitId,
  open,
  onClose,
}: ViewBusinessUnitDialogProps) => {
  const { data: businessUnit, isPending: isPendingLatestBusinessUnit } =
    useGetBusinessUnit({
      businessUnitId,
    });

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View Business Unit"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <BusinessUnitForm
        defaultValues={businessUnit}
        loading={isPendingLatestBusinessUnit}
        disabled
      />
    </Dialog>
  );
};
