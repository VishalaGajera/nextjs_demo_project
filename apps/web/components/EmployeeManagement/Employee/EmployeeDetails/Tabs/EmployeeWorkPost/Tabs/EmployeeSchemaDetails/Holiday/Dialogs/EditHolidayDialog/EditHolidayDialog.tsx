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
  type EditHolidayFormFieldValues,
  type EditHolidayFormProps,
  type FormRef,
  EditHolidayForm,
} from "./EditHolidayForm";

type EditHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  companyId: string;
  employeeId: string;
  onEditSuccess: () => void;
};

export const EditHolidayDialog = ({
  onClose,
  open,
  employeeId,
  companyId,
  onEditSuccess,
}: EditHolidayDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { operationType, menuItems } = useTabOptions({});

  const { data: holidayDetails, isFetching } = useGetSectionSchemaDetail({
    employeeId,
    section: "holiday_group",
  });

  const { mutate, isPending } = useEditSchemaDetails({
    employeeId,
    section: "holiday_group",
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();

        onEditSuccess();

        toasts.success({ title: data.message });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: EditHolidayFormFieldValues = merge(error);

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
    if (holidayDetails) {
      const reportingManagerFormFieldValues: EditHolidayFormProps["defaultValues"] =
        {
          id: holidayDetails.id,
          effective_from: holidayDetails.effective_from,
          remark: holidayDetails.remark,
          joining_date: holidayDetails.joining_date,
          operationType,
        };

      return reportingManagerFormFieldValues;
    }
  }, [holidayDetails]);

  const onEditHoliday = () => {
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
      title="Edit Holiday"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditHoliday}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs tabs={menuItems} value={operationType} loading={isFetching} />

      <EditHolidayForm
        ref={formRef}
        operationType={operationType}
        loading={isFetching}
        defaultValues={defaultValues}
        companyId={companyId}
      />
    </Dialog>
  );
};
