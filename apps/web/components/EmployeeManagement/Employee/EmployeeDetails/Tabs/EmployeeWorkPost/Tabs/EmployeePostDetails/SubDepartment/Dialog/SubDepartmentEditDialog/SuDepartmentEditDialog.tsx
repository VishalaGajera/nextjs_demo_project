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
  SubDepartmentFormFieldValues,
  SubDepartmentFormProps,
} from "./SubDepartmentEditForm";
import { SubDepartmentEditForm } from "./SubDepartmentEditForm";

type EditSubDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  departmentId: string;
};

export const EditSubDepartmentDialog = ({
  employeeId,
  departmentId,
  open,
  onClose,
  onEditSuccess,
}: EditSubDepartmentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { operationType, menuItems } = useTabOptions({});

  const {
    data: subDepartmentDetails,
    isPending: isPendingSubDepartmentDetail,
  } = useGetSectionPostDetail({
    employeeId,
    section: "sub_department",
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

        const formattedError: SubDepartmentFormFieldValues = merge(
          error["sub_department"]
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
    if (subDepartmentDetails) {
      const subDepartmentFormValues: SubDepartmentFormProps["defaultValues"] = {
        id: subDepartmentDetails.id,
        effective_from: subDepartmentDetails.effective_from,
        joining_date: subDepartmentDetails.joining_date,
        remark: subDepartmentDetails.remark,
        operationType,
      };

      return subDepartmentFormValues;
    }
  }, [subDepartmentDetails]);

  const onEditSubDepartment = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditDepartmentPayload = {
        sub_department: {
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
      title="Edit Sub Department"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditSubDepartment}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingSubDepartmentDetail}
      />

      <SubDepartmentEditForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingSubDepartmentDetail}
        departmentId={departmentId}
      />
    </Dialog>
  );
};
