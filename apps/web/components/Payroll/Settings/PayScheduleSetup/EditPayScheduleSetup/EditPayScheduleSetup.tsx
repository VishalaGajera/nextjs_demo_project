import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useRef } from "react";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import {
  type FormRef,
  monthlyVariationConfig,
  PayScheduleSetupForm,
} from "../AddPayScheduleSetup/PayScheduleSetupForm";
import { useEditPayScheduleSetup } from "./hooks/useEditPayScheduleSetup";
import { useGetPayScheduleSetup } from "./hooks/useGetPayScheduleSetup";

type EditPayScheduleSetupProps = {
  payScheduleSetupId: string;
};

export const EditPayScheduleSetup = ({
  payScheduleSetupId,
}: EditPayScheduleSetupProps) => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const {
    data: payScheduleSetupData,
    isPending: isPendingLatestPayScheduleSetupData,
  } = useGetPayScheduleSetup({
    payScheduleSetupId,
  });

  const { mutate, isPending } = useEditPayScheduleSetup({
    payScheduleSetupId,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/payroll/settings/pay-schedule-setup");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const defaultValues = useMemo(() => {
    if (payScheduleSetupData) {
      const payScheduleSetupValues = {
        ...payScheduleSetupData,
        monthly_variations:
          payScheduleSetupData.monthly_variations ?? monthlyVariationConfig,
      };

      return payScheduleSetupValues;
    }
  }, [payScheduleSetupData]);

  const onEditPayScheduleSetup = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Fragment>
      <PayScheduleSetupForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingLatestPayScheduleSetupData}
      />

      <PadBox padding={{ paddingRight: "20px" }}>
        <Stack direction="row" justifyContent="end" gap="10px">
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/payroll/settings/pay-schedule-setup");
            }}
          >
            Cancel
          </Button>

          <EditAction onClick={onEditPayScheduleSetup} loading={isPending} />
        </Stack>
      </PadBox>
    </Fragment>
  );
};
