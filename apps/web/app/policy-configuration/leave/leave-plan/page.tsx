"use client";

import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useGetLeavePlanList } from "../../../../components/PolicyConfiguration/Leave/LeavePlan/LeavePlanSideBar/hooks/useGetLeavePlanList";
import { LeavePlanSideBar } from "../../../../components/PolicyConfiguration/Leave/LeavePlan/LeavePlanSideBar/LeavePlanSideBar";
import { LeavePlanType } from "../../../../components/PolicyConfiguration/Leave/LeavePlan/LeavePlanType/LeavePlanType";

export type leavePlanFormField = {
  searchText: string;
  company_id: string;
};

export default function Page() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const leavePlanId = searchParams.get("tab") ?? "";

  const formMethods = useForm<leavePlanFormField>({
    defaultValues: {
      searchText: "",
      company_id: "",
    },
  });

  const { watch } = formMethods;

  const companyId = watch("company_id");

  const { data: leavePlanListData, isFetching } = useGetLeavePlanList({
    companyId,
  });

  const selectedLeavePlanTitle = leavePlanListData.find(
    (leavePlan) => leavePlan.id === leavePlanId
  )?.leave_plan_name;

  return (
    <Stack gap="10px">
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
            text: "Leave Plan",
          },
        ]}
      />

      <Stack direction="row" gap="25px" sx={{ flex: 1 }}>
        <FormProvider {...formMethods}>
          <LeavePlanSideBar
            leavePlanId={leavePlanId}
            leavePlanListData={leavePlanListData}
            isLoading={isFetching}
          />
        </FormProvider>

        {leavePlanId && (
          <LeavePlanType
            leavePlanId={leavePlanId}
            selectedLeavePlanTitle={selectedLeavePlanTitle}
          />
        )}
      </Stack>
    </Stack>
  );
}
