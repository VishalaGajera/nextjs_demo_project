import {
  Button,
  dateFormats,
  Dialog,
  Tabs,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
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
  EditLeavePlanForm,
  type EditLeavePlanFormProps,
  type FormRef,
} from "./EditLeavePlanForm";

type EditLeavePlanDialogProps = {
  open: boolean;
  onClose: () => void;
  companyId: string;
  employeeId: string;
  onEditSuccess: () => void;
};

export const EditLeavePlanDialog = ({
  onClose,
  open,
  employeeId,
  companyId,
  onEditSuccess,
}: EditLeavePlanDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { operationType, menuItems } = useTabOptions({});

  const { data: leavePlanDetails, isFetching } = useGetSectionSchemaDetail({
    employeeId,
    section: "leave_plan",
  });

  const { mutate, isPending } = useEditSchemaDetails({
    employeeId,
    section: "leave_plan",
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();

        onEditSuccess();

        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const defaultValues = useMemo(() => {
    if (leavePlanDetails) {
      const leavePlanFormFieldValues: EditLeavePlanFormProps["defaultValues"] =
        {
          id: leavePlanDetails.id,
          effective_from: leavePlanDetails.effective_from,
          remark: leavePlanDetails.remark,
          joining_date: leavePlanDetails.joining_date,
          operationType,
        };

      return leavePlanFormFieldValues;
    }
  }, [leavePlanDetails]);

  const onEditLeavePlan = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditSchemaPayload = {
        id: formValues.id,
        remark: formValues.remark,
        effective_from:
          formValues.effective_from &&
          DateTime.fromISO(formValues.effective_from).toFormat(
            dateFormats.dateWithISO8601
          ),
      };

      mutate(payload);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Leave Plan"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditLeavePlan}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs tabs={menuItems} value={operationType} loading={isFetching} />

      <EditLeavePlanForm
        ref={formRef}
        operationType={operationType}
        loading={isFetching}
        defaultValues={defaultValues}
        companyId={companyId}
      />
    </Dialog>
  );
};
