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
import { useTabOptions } from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import {
  type EditSchemaPayload,
  useEditSchemaDetails,
} from "../../../hooks/useEditSchemaDetails";
import { useGetSectionSchemaDetail } from "../../../hooks/useGetSectionSchemaDetails";
import {
  type EditShiftFormFieldValues,
  type EditShiftFormProps,
  type FormRef,
  EditShiftForm,
} from "./EditShiftForm";

type EditShiftDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const EditShiftDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditShiftDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { operationType, menuItems } = useTabOptions({});

  const { data: shiftTypeDetails, isFetching: isPendingShiftDetail } =
    useGetSectionSchemaDetail({ employeeId, section: "shift_type" });

  const { mutate, isPending } = useEditSchemaDetails({
    employeeId,
    section: "shift_type",
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: EditShiftFormFieldValues = merge(error);

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
    if (shiftTypeDetails) {
      const shiftFormFieldValues: EditShiftFormProps["defaultValues"] = {
        id: shiftTypeDetails.id,
        effective_from: shiftTypeDetails.effective_from,
        effective_to: shiftTypeDetails.effective_to,
        has_no_end_date: shiftTypeDetails.has_no_end_date,
        remark: shiftTypeDetails.remark,
        joining_date: shiftTypeDetails.joining_date,
        operationType,
      };

      return shiftFormFieldValues;
    }
  }, [shiftTypeDetails]);

  const onEditShift = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditSchemaPayload = {
        id: formValues.id,
        remark: formValues.remark,
        has_no_end_date: formValues.has_no_end_date,
        effective_from:
          formValues?.effective_from &&
          DateTime.fromISO(formValues.effective_from).toFormat(
            dateFormats.dateWithISO8601
          ),
        effective_to:
          formValues?.effective_to &&
          DateTime.fromISO(formValues.effective_to).toFormat(
            dateFormats.dateWithISO8601
          ),
      };

      mutate(payload);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Shift"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditShift}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingShiftDetail}
      />

      <EditShiftForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingShiftDetail}
        companyId={companyId}
      />
    </Dialog>
  );
};
