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
  EditSkillTypeFormFieldValues,
  EditSkillTypeFormProps,
  FormRef,
} from "./EditSkillTypeForm";
import { EditSkillTypeForm } from "./EditSkillTypeForm";

type EditSkillTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const EditSkillTypeDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditSkillTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: skillTypeDetail, isPending: isSkillTypePending } =
    useGetSectionPostDetail({
      employeeId,
      section: "skill_type",
    });

  const { operationType, menuItems } = useTabOptions({
    effectFrom: !!skillTypeDetail?.effective_from,
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

        const formattedError: EditSkillTypeFormFieldValues = merge(
          error["skill_type"]
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
    if (skillTypeDetail) {
      const skillTypeFormValues: EditSkillTypeFormProps["defaultValues"] = {
        id: skillTypeDetail.id,
        effective_from: skillTypeDetail.effective_from,
        joining_date: skillTypeDetail.joining_date,
        remark: skillTypeDetail.remark,
        operationType,
      };

      return skillTypeFormValues;
    }
  }, [skillTypeDetail]);

  const onEditSkillType = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditDepartmentPayload = {
        skill_type: {
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
      title="Edit Skill Type"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditSkillType}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isSkillTypePending}
      />

      <EditSkillTypeForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isSkillTypePending}
        companyId={companyId}
      />
    </Dialog>
  );
};
