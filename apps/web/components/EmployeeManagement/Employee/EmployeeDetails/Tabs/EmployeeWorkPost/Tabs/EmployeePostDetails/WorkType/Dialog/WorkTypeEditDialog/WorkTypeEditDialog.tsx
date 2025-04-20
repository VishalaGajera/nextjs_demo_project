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
import type { EditDepartmentPayload } from "../../../hooks/useEditPostDetails";
import { useEditPostDetails } from "../../../hooks/useEditPostDetails";
import { useGetSectionPostDetail } from "../../../hooks/useGetSectionPostDetail";
import type {
  FormRef,
  WorkTypeEditFormProps,
  WorkTypeEditFormValues,
} from "./WorkTypeEditForm";
import { WorkTypeEditForm } from "./WorkTypeEditForm";

type WorkTypeEditDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const WorkTypeEditDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: WorkTypeEditDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: workTypeDetail, isPending: isWorkTypePending } =
    useGetSectionPostDetail({
      employeeId,
      section: "work_type",
    });

  const { operationType, menuItems } = useTabOptions({
    effectFrom: !!workTypeDetail?.effective_from,
  });

  const { mutate, isPending } = useEditPostDetails({
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

        const formattedError: WorkTypeEditFormValues = merge(
          error["work_type"]
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
    if (workTypeDetail) {
      const workTypeFormValues: WorkTypeEditFormProps["defaultValues"] = {
        id: workTypeDetail.id,
        effective_from: workTypeDetail.effective_from,
        joining_date: workTypeDetail.joining_date,
        remark: workTypeDetail.remark,
        operationType,
      };

      return workTypeFormValues;
    }
  }, [workTypeDetail]);

  const onEditWorkType = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditDepartmentPayload = {
        work_type: {
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
      title="Edit Work Type"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditWorkType}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isWorkTypePending}
      />

      <WorkTypeEditForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isWorkTypePending}
        companyId={companyId}
      />
    </Dialog>
  );
};
