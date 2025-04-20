import {
  Button,
  dateFormats,
  Dialog,
  Tabs,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { merge } from "lodash";
import { DateTime } from "luxon";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../../../../utils/errors";
import { EditAction } from "../../../../../../../../../../common/EditAction";
import { useTabOptions } from "../../../BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import {
  type EditOrganizationDetailPayload,
  useEditOrganizationDetails,
} from "../../../hooks/useEditOrganizationDetails";
import { useGetEmployeeOrganizationSectionDetail } from "../../../hooks/useGetOrganizationSectionDetail";
import type {
  FormRef,
  LocationUnitFormFieldValues,
  LocationUnitFormProps,
} from "./LocationUnitForm";
import { LocationUnitForm } from "./LocationUnitForm";

type EditLocationUnitDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
};

export const EditLocationUnitDialog = ({
  employeeId,
  open,
  onClose,
  onEditSuccess,
}: EditLocationUnitDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { operationType, menuItems } = useTabOptions({});

  const { data: businessUnitDetails, isFetching: isPendingBusinessUnit } =
    useGetEmployeeOrganizationSectionDetail({
      employeeId,
      section: "business_unit",
    });

  const {
    data: businessLocationUnitDetails,
    isFetching: isPendingBusinessUnitLocation,
  } = useGetEmployeeOrganizationSectionDetail({
    employeeId,
    section: "business_unit_location",
  });

  const { mutate, isPending } = useEditOrganizationDetails({
    employeeId,
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: LocationUnitFormFieldValues = merge(
          error["business_unit_location"]
        );

        const structuredError = {
          response: {
            data: {
              message,
              error: formattedError,
            },
          },
          status: res.status,
        };

        onError(structuredError, formRef.current?.setError);
      },
    },
  });

  const defaultValues = useMemo(() => {
    if (businessLocationUnitDetails && businessUnitDetails) {
      const businessUnitLocationFormFieldValues: LocationUnitFormProps["defaultValues"] =
        {
          id: businessLocationUnitDetails.id,
          effective_from: businessLocationUnitDetails.effective_from,
          remark: businessLocationUnitDetails.remark,
          joining_date: businessUnitDetails.joining_date,
          operationType,
        };

      return businessUnitLocationFormFieldValues;
    }
  }, [businessLocationUnitDetails, businessUnitDetails]);

  const onEditBusinessUnit = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditOrganizationDetailPayload = {
        business_unit_location: {
          id: formValues.id,
          remark: formValues.remark,
          effective_from:
            formValues.effective_from &&
            DateTime.fromISO(formValues.effective_from).toFormat(
              dateFormats.dateWithISO8601
            ),
        },
      };

      mutate(payload);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Location"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditBusinessUnit}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingBusinessUnit || isPendingBusinessUnitLocation}
      />

      <LocationUnitForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingBusinessUnit || isPendingBusinessUnitLocation}
        businessUnitId={businessUnitDetails?.id}
      />
    </Dialog>
  );
};
