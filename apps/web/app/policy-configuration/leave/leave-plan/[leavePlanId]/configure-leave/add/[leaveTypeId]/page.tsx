"use client";

import { Breadcrumbs, Button, SvgsHome, toasts } from "@codezee/sixtify-brahma";
import { Box, Stack, useTheme } from "@mui/material";
import { isEmpty } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { ConfigureLeave } from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/ConfigureLeave/ConfigureLeave";
import type { FormRef } from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/ConfigureLeave/ConfigureLeaveForm/ConfigureLeaveForm";
import {
  configurationFormSteps,
  getStepperLabel,
  handlePreviousStep,
  onSetupConfigureLeave,
} from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/ConfigureLeave/hooks/helper";
import { useSetupConfigureLeave } from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/ConfigureLeave/hooks/useSetupConfigureLeave";
import { useGetLeavePlanList } from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/LeavePlanSideBar/hooks/useGetLeavePlanList";
import { onError } from "../../../../../../../../utils/errors";

export type PageProps = Readonly<{
  params: {
    leavePlanId: string;
    leaveTypeId: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const router = useRouter();

  const searchParams = useSearchParams();

  const [leaveLimitType, setLeaveLimitType] = useState<string>("");

  const configurationStep = searchParams.get("step") ?? "";

  const stepperLabel = getStepperLabel(leaveLimitType);

  const currentStep = stepperLabel.indexOf(
    configurationFormSteps(configurationStep)
  );

  const { leavePlanId, leaveTypeId } = params;

  const { data: leavePlanListData } = useGetLeavePlanList({});

  const selectedLeavePlanMonth = useMemo(() => {
    return (
      leavePlanListData
        .find((leavePlan) => leavePlan.id === leavePlanId)
        ?.year_cycle?.toString() ?? ""
    );
  }, [leavePlanListData]);

  const companyId = useMemo(() => {
    return (
      leavePlanListData.find((leavePlan) => leavePlan.id === leavePlanId)
        ?.company_id ?? ""
    );
  }, [leavePlanListData]);

  const formRef = useRef<FormRef>(null);

  const { mutate, isPending } = useSetupConfigureLeave({
    leavePlanId,
    leaveTypeId,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push(
          `/policy-configuration/leave/leave-plan?tab=${leavePlanId}`
        );
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const handleCancel = () => {
    return router.push(
      `/policy-configuration/leave/leave-plan?tab=${leavePlanId}`
    );
  };

  const handleFormSteps = (step: string) => {
    if (isEmpty(formRef.current?.errors)) {
      return router.push(
        `/policy-configuration/leave/leave-plan/${leavePlanId}/configure-leave/add/${leaveTypeId}?step=${step}`
      );
    }
  };

  return (
    <Stack gap={1}>
      <Breadcrumbs
        items={[
          {
            icon: <SvgsHome />,
            onClick: () => router.push("/"),
          },
          {
            text: "Policy Configuration",
          },
          {
            text: "Leave",
          },
          {
            text: "Leave Plan",
            onClick: () =>
              router.push("/policy-configuration/leave/leave-plan"),
          },
          {
            text: `${configurationFormSteps(configurationStep)}`,
          },
        ]}
      />

      <Box>
        <ConfigureLeave
          selectedLeavePlanMonth={selectedLeavePlanMonth}
          currentStep={currentStep}
          leavePlanId={leavePlanId}
          leaveTypeId={leaveTypeId}
          configurationStep={configurationStep}
          companyId={companyId}
          formType="add"
          formRef={formRef}
        />

        <Stack
          direction="row"
          gap="5px"
          justifyContent="flex-end"
          bgcolor={iron[600]}
          padding={2}
        >
          <Button variant="outlined" onClick={() => handleCancel()}>
            Cancel
          </Button>

          {configurationStep !== "accrual" && (
            <Button
              onClick={() => {
                handlePreviousStep(configurationStep, formRef, handleFormSteps);
              }}
            >
              Previous
            </Button>
          )}

          <Button
            onClick={() => {
              onSetupConfigureLeave(
                configurationStep,
                formRef,
                handleFormSteps,
                mutate,
                setLeaveLimitType
              );
            }}
            loading={isPending}
          >
            Save & Next
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
