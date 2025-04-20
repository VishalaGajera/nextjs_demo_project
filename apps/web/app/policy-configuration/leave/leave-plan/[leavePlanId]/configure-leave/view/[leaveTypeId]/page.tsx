"use client";

import { Breadcrumbs, Button, SvgsHome } from "@codezee/sixtify-brahma";
import { Box, Skeleton, Stack, useTheme } from "@mui/material";
import { isEmpty } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { ConfigureLeave } from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/ConfigureLeave/ConfigureLeave";
import type {
  ConfigureLeaveFormFieldValues,
  FormRef,
} from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/ConfigureLeave/ConfigureLeaveForm/ConfigureLeaveForm";
import {
  configurationFormSteps,
  getStepperLabel,
  handlePreviousStep,
} from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/ConfigureLeave/hooks/helper";
import { useGetSetupConfigureLeave } from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/ConfigureLeave/hooks/useGetSetupConfigureLeave";
import { useGetLeavePlanList } from "../../../../../../../../components/PolicyConfiguration/Leave/LeavePlan/LeavePlanSideBar/hooks/useGetLeavePlanList";

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

  const { data: defaultValues } = useGetSetupConfigureLeave({
    leavePlanId,
    leaveTypeId,
  });

  const initialValues = useMemo(() => {
    if (defaultValues) {
      const initialWorkFlow = defaultValues?.leave_approval.approval_levels;

      const values = {
        ...defaultValues,
        leave_approval: {
          ...defaultValues?.leave_approval,
          approval_levels:
            initialWorkFlow?.map((workFlow) => {
              return {
                ...workFlow,
                level_approvers: workFlow.level_approvers?.map(
                  (item) => item.employee_id
                ),
              };
            }) ?? null,
        },
      };

      return values;
    }

    return defaultValues;
  }, [defaultValues]);

  const formRef = useRef<FormRef>(null);

  const handleCancel = () => {
    return router.push(
      `/policy-configuration/leave/leave-plan?tab=${leavePlanId}`
    );
  };

  const handleFormSteps = (step: string) => {
    if (isEmpty(formRef.current?.errors)) {
      return router.push(
        `/policy-configuration/leave/leave-plan/${leavePlanId}/configure-leave/view/${leaveTypeId}?step=${step}`
      );
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onSetupConfigureLeave = async () => {
    if (configurationStep == "accrual") {
      const leaveLimitType = initialValues?.leave_quota.quota_type ?? "";

      if (leaveLimitType === "limited") {
        handleFormSteps("accrual-prorate");
      } else {
        handleFormSteps("application-usage");
      }

      setLeaveLimitType(leaveLimitType);
    }

    if (configurationStep == "accrual-prorate") {
      handleFormSteps("application-usage");
    }

    if (configurationStep == "application-usage") {
      handleFormSteps("sandwich");
    }

    if (configurationStep == "sandwich") {
      handleFormSteps("approval");
    }

    if (configurationStep == "approval") {
      handleFormSteps("year-end");
    }
  };

  const quotaType = initialValues?.leave_quota.quota_type ?? "";

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
      {defaultValues ? (
        <Box>
          <ConfigureLeave
            selectedLeavePlanMonth={selectedLeavePlanMonth}
            currentStep={currentStep}
            leavePlanId={leavePlanId}
            leaveTypeId={leaveTypeId}
            configurationStep={configurationStep}
            companyId={companyId}
            formType="view"
            defaultValues={initialValues as ConfigureLeaveFormFieldValues}
            disabled
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
                  handlePreviousStep(
                    configurationStep,
                    formRef,
                    handleFormSteps
                  );
                }}
              >
                Previous
              </Button>
            )}

            <Button
              onClick={() => {
                onSetupConfigureLeave();
              }}
              disabled={currentStep == (quotaType === "unlimited" ? 4 : 5)}
            >
              Next
            </Button>
          </Stack>
        </Box>
      ) : (
        <Stack gap={1}>
          <Skeleton
            sx={{
              transform: "scale(1)",
              height: "100px",
            }}
          />
          <Skeleton
            sx={{
              transform: "scale(1)",
              height: "200px",
            }}
          />
        </Stack>
      )}
    </Stack>
  );
}
