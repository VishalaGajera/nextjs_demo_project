"use client";

import { Breadcrumbs, Card, PadBox, SvgsHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { EditLoan } from "../../../../../components/Payroll/PayrollTransaction/Loan/EditLoan/EditLoan";

export type PageProps = Readonly<{
  params: {
    loanId: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const router = useRouter();

  const { loanId } = params;

  const breadcrumbsItems = [
    {
      icon: <SvgsHome />,
      onClick: () => router.push("/"),
    },
    {
      text: "Payroll",
    },
    {
      text: "Payroll Transaction",
    },
    {
      text: "Loan",
      onClick: () => router.push("/payroll/payroll-transaction/loan"),
    },
    {
      text: "Edit Loan",
    },
  ];

  return (
    <Stack gap="10px">
      <Breadcrumbs items={breadcrumbsItems} />

      <Card heading="Pay Schedule Setup">
        <PadBox padding={{ padding: "15px" }}>
          <EditLoan loanId={loanId} />
        </PadBox>
      </Card>
    </Stack>
  );
}
