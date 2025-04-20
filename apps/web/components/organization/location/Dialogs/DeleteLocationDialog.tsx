import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../utils/errors";
import type { Location } from "../LocationList/hooks/useGetLocations";
import { useDeleteLocation } from "./hooks/useDeleteLocationBank";

type DeleteLocationDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  location: Location;
};

export const DeleteLocationDialog = ({
  location,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteLocationDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteLocation({
    locationId: location.id,
    options: {
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  return (
    <DeleteDialog
      title={t("location.dialog.delete.message", {
        locationName: location.location_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
