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
  type EditWeeklyOffFormFieldValues,
  type EditWeeklyOffFormProps,
  type FormRef,
  EditWeeklyOffForm,
} from "./EditWeeklyOffForm";

type EditWeeklyOffDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const EditWeeklyOffDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditWeeklyOffDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { operationType, menuItems } = useTabOptions({});

  const { data: weeklyOffDetails, isFetching: isPendingWeeklyOffDetail } =
    useGetSectionSchemaDetail({ employeeId, section: "weekly_off_type" });

  const { mutate, isPending } = useEditSchemaDetails({
    employeeId,
    section: "weekly_off_type",
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: EditWeeklyOffFormFieldValues = merge(error);

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
    if (weeklyOffDetails) {
      const weeklyOffFormFieldValues: EditWeeklyOffFormProps["defaultValues"] =
        {
          id: weeklyOffDetails.id,
          effective_from: weeklyOffDetails.effective_from,
          effective_to: weeklyOffDetails.effective_to,
          has_no_end_date: weeklyOffDetails.has_no_end_date,
          remark: weeklyOffDetails.remark,
          joining_date: weeklyOffDetails.joining_date,
          operationType,
        };

      return weeklyOffFormFieldValues;
    }
  }, [weeklyOffDetails]);

  const onEditWeeklyOff = () => {
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
      title="Edit Weekly Off"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditWeeklyOff}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingWeeklyOffDetail}
      />

      <EditWeeklyOffForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingWeeklyOffDetail}
        companyId={companyId}
      />
    </Dialog>
  );
};
