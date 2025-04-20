"use client";

import { Breadcrumbs, Card, PadBox, SvgsHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { EditPayScheduleSetup } from "../../../../../components/Payroll/Settings/PayScheduleSetup/EditPayScheduleSetup/EditPayScheduleSetup";

export type PageProps = Readonly<{
  params: {
    payScheduleSetupId: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const router = useRouter();

  const { payScheduleSetupId } = params;

  return (
    <Stack gap="10px">
      <Breadcrumbs
        items={[
          {
            icon: <SvgsHome />,
            onClick: () => router.push("/"),
          },
          {
            text: "Payroll",
          },
          {
            text: "Settings",
          },
          {
            text: "Pay Schedule Setup",
            onClick: () => router.push("/payroll/settings/pay-schedule-setup"),
          },
          {
            text: "Edit Pay Schedule Setup",
          },
        ]}
      />
      <Card heading="Pay Schedule Setup">
        <PadBox padding={{ padding: "15px" }}>
          <EditPayScheduleSetup payScheduleSetupId={payScheduleSetupId} />
        </PadBox>
      </Card>
    </Stack>
  );
}
