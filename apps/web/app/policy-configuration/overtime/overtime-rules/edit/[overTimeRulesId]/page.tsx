"use client";

import { Button, Card, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { EditAction } from "../../../../../../components/common/EditAction";
import type { FormRef } from "../../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/AddOvertimeRules/AddOvertimeRulesForm";
import { AddOvertimeRulesForm } from "../../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/AddOvertimeRules/AddOvertimeRulesForm";
import { EditOvertimeRulesBreadcrumbs } from "../../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/EditOvertimeRules/EditOvertimeRulesBreadcrumbs";
import { useEditOvertimeRules } from "../../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/EditOvertimeRules/Hooks/useEditOvertimeRules";
import { useGetOvertimeRules } from "../../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/EditOvertimeRules/Hooks/useGetOvertimeRules";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { useDisabledButtonsCache } from "../../../../../context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";

export type OvertimeRulesListRef = {
  refreshOvertimeRulesList: () => void;
};
export type PageProps = Readonly<{
  params: {
    overTimeRulesId: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const { overTimeRulesId } = params;

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const router = useRouter();

  const { data: overTimesRules, isPending: isGetOverTimesRulesPending } =
    useGetOvertimeRules({
      overTimeRulesId,
    });

  const { mutate, isPending } = useEditOvertimeRules({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/policy-configuration/overtime/overtime-rules");
      },
    },
    overTimeRulesId,
  });

  const onEditOvertimeRules = () => {
    formRef.current?.submitForm((payloadData) => {
      return mutate(payloadData);
    });
  };

  return (
    <Stack gap="10px">
      <EditOvertimeRulesBreadcrumbs />
      <Card>
        <AddOvertimeRulesForm
          ref={formRef}
          defaultValues={overTimesRules}
          loading={isGetOverTimesRulesPending}
          type="edit"
        />

        <Stack direction="row" gap="5px" justifyContent="flex-end">
          <Button
            onClick={() =>
              router.push("/policy-configuration/overtime/overtime-rules")
            }
            variant="outlined"
          >
            Cancel
          </Button>

          <EditAction
            onClick={onEditOvertimeRules}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
