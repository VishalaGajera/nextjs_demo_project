"use client";

import { Button, Card, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { AddOvertimeRulesBreadcrumbs } from "../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/AddOvertimeRules/AddOvertimeRulesBreadcrumbs";
import type { FormRef } from "../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/AddOvertimeRules/AddOvertimeRulesForm";
import { AddOvertimeRulesForm } from "../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/AddOvertimeRules/AddOvertimeRulesForm";
import { useAddOvertimeRules } from "../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/AddOvertimeRules/hooks/useAddOvertimeRules";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { useDisabledButtonsCache } from "../../../../context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";

export type OvertimeRulesListRef = {
  refreshOvertimeRulesList: () => void;
};

export default function Page() {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const router = useRouter();

  const { mutate, isPending } = useAddOvertimeRules({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/policy-configuration/overtime/overtime-rules");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onAddOvertimeRules = () => {
    formRef.current?.submitForm((payloadData) => {
      mutate(payloadData);
    });
  };

  return (
    <Stack gap="10px">
      <AddOvertimeRulesBreadcrumbs />

      <Card>
        <AddOvertimeRulesForm ref={formRef} />

        <PadBox padding={{ paddingX: "40px" }}>
          <Stack direction="row" gap="5px" justifyContent="flex-end">
            <Button
              onClick={() =>
                router.push("/policy-configuration/overtime/overtime-rules")
              }
              variant="outlined"
            >
              Cancel
            </Button>

            <Button
              onClick={onAddOvertimeRules}
              loading={isPending}
              disabled={isDisabled()}
            >
              Save
            </Button>
          </Stack>
        </PadBox>
      </Card>
    </Stack>
  );
}
