import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter, useSearchParams } from "next/navigation";
import type { OptionKey } from "./Tabs/hooks/useTabsOptions";
import { categories } from "./Tabs/hooks/useTabsOptions";

export const ContributionsBreadCrumbs = () => {
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
          text: "Payroll",
        },
        {
          text: "Settings",
        },
        {
          text: "Contributions",
        },
        {
          text: categories[tab as OptionKey],
        },
      ]}
    />
  );
};
