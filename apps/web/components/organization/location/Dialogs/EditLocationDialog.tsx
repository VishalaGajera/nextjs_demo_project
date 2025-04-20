import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../utils/errors";
import { EditAction } from "../../../common/EditAction";
import { useEditLocation } from "./hooks/useEditLocation";
import { useGetLocation } from "./hooks/useGetLocation";
import {
  LocationForm,
  type FormRef,
  type LocationFormFieldValues,
} from "./LocationForm";

type EditLocationUnitDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  locationId: string;
};

export const EditLocationUnitDialog = ({
  locationId,
  open,
  onClose,
  onEditSuccess,
}: EditLocationUnitDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: location, isPending: isPendingLatestLocation } = useGetLocation(
    {
      locationId,
    }
  );

  const { mutate, isPending } = useEditLocation({
    locationId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditLocation = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (location) {
      const locationFormFieldValues: LocationFormFieldValues = {
        business_unit_id: location.business_unit_id,
        location_name: location.location_name,
        email: location.email,
        phone_no: location.phone_no,
        mobile_no: location.mobile_no,
        address: location.address,
        city_id: location.city_id,
        state_id: location.state_id,
        country_id: location.country_id,
        pin_code: location.pin_code,
        business_unit_location_heads: location.business_unit_location_heads,
      };

      return locationFormFieldValues;
    }
  }, [location]);

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Location"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditLocation}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <LocationForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingLatestLocation}
      />
    </Dialog>
  );
};
