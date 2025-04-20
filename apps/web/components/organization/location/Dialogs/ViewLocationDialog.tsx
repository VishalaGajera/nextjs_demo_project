import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useGetLocation } from "./hooks/useGetLocation";
import { LocationForm } from "./LocationForm";

type ViewLocationUnitDialogProps = {
  open: boolean;
  onClose: () => void;
  locationId: string;
};

export const ViewLocationUnitDialog = ({
  locationId,
  open,
  onClose,
}: ViewLocationUnitDialogProps) => {
  const { data: location, isPending: isPendingLatestLocation } = useGetLocation(
    {
      locationId,
    }
  );

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View Location"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <LocationForm
        defaultValues={location}
        loading={isPendingLatestLocation}
        disabled
      />
    </Dialog>
  );
};
