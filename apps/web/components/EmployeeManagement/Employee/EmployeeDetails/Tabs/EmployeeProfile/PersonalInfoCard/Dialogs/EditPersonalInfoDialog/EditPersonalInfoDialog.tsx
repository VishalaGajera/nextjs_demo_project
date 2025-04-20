import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../../utils/errors";
import { EditAction } from "../../../../../../../../common/EditAction";
import { useGetPersonalInfo } from "../../hooks/useGetPersonalInfo";
import { useEditPersonalInfo } from "./hooks/useEditPersonalInfo";
import type { FormRef } from "./PersonalInfoForm";
import { PersonalInformationForm } from "./PersonalInfoForm";

type EditPersonalInfoDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
};

export const EditPersonalInfoDialog = ({
  employeeId,
  open,
  onClose,
  onEditSuccess,
}: EditPersonalInfoDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: personalInformationData,
    isPending: isPendingPersonalInformation,
  } = useGetPersonalInfo({
    employeeId,
  });

  const { mutate, isPending } = useEditPersonalInfo({
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditPersonalInformation = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (personalInformationData) {
      const employeeCodeFormFieldValues = {
        place_of_birth: personalInformationData.place_of_birth,
        blood_group: personalInformationData.blood_group,
        marital_status: personalInformationData.marital_status,
        marriage_date: personalInformationData.marriage_date,
        nationality: personalInformationData.nationality,
        religion: personalInformationData.religion,
        father_name: personalInformationData.father_name,
        spouse_name: personalInformationData.spouse_name,
        is_physically_challenged:
          personalInformationData.is_physically_challenged ?? false,
        identity_mark: personalInformationData.identity_mark,
        caste: personalInformationData.caste,
        sub_caste_id: personalInformationData.sub_caste_id,
        sub_caste_name: personalInformationData.sub_caste_name,
      };

      return employeeCodeFormFieldValues;
    }
  }, [personalInformationData]);

  return (
    <Dialog
      maxWidth="xl"
      onClose={onClose}
      open={open}
      title="Edit Personal Information"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditPersonalInformation}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <PersonalInformationForm
        ref={formRef}
        defaultValues={defaultValues}
        employeeId={employeeId}
        loading={isPendingPersonalInformation}
      />
    </Dialog>
  );
};
