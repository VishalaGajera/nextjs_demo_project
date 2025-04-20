"use client";

import { Breadcrumbs, Card, PadBox, SvgsHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { EditBankPaySchedule } from "../../../../components/BankConfiguration/BankPaySchedule/EditBankPaySchedule/EditBankPaySchedule";

export type PageProps = Readonly<{
  params: {
    bankPayScheduleId: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const router = useRouter();

  const { bankPayScheduleId } = params;

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
            text: "Bank Pay Schedule",
            onClick: () =>
              router.push("/bank-configurations/bank-pay-schedule"),
          },
          {
            text: "Edit Bank Pay Schedule",
          },
        ]}
      />

      <Card heading="Bank Pay Schedule">
        <PadBox padding={{ padding: "15px" }}>
          <EditBankPaySchedule bankPayScheduleId={bankPayScheduleId} />
        </PadBox>
      </Card>
    </Stack>
  );
}
