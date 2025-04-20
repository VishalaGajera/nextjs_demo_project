"use client";

import { Button, Card } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import type { FormRef } from "../../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/AddOvertimeRules/AddOvertimeRulesForm";
import { AddOvertimeRulesForm } from "../../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/AddOvertimeRules/AddOvertimeRulesForm";
import { useGetOvertimeRules } from "../../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/EditOvertimeRules/Hooks/useGetOvertimeRules";
import { ViewOvertimeRulesBreadcrumbs } from "../../../../../../components/PolicyConfiguration/Overtime/OvertimeRules/ViewOvertimeRules/ViewOvertimeRulesBreadcrumbs";

export type PageProps = Readonly<{
  params: {
    overTimeRulesId: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const { overTimeRulesId } = params;

  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { data: overTimesRules, isPending: isGetOverTimesRulesPending } =
    useGetOvertimeRules({
      overTimeRulesId,
    });

  return (
    <Stack gap="10px">
      <ViewOvertimeRulesBreadcrumbs />
      <Card>
        <AddOvertimeRulesForm
          ref={formRef}
          defaultValues={overTimesRules}
          loading={isGetOverTimesRulesPending}
          disabled
          type="view"
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
        </Stack>
      </Card>
    </Stack>
  );
}
