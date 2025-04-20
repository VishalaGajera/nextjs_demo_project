"use client";

import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, type OptionKey } from "./Tabs/hooks/useTabsOptions";

export const OvertimeBreadCrumbs = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  return (
    <Breadcrumbs
      items={[
        {
          icon: <SvgsHome />,
          onClick: () => router.push("/"),
        },
        {
          text: "Transactions",
        },
        {
          text: "Approvals",
        },
        {
          text: categories[tab as OptionKey],
        },
      ]}
    />
  );
};
