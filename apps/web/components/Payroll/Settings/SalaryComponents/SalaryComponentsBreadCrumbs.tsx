import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter, useSearchParams } from "next/navigation";
import type { OptionKey } from "./Tabs/hooks/useTabsOptions";
import { categories } from "./Tabs/hooks/useTabsOptions";

export const SalaryComponentsBreadCrumbs = () => {
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
          text: "Salary Components",
        },
        {
          text: categories[tab as OptionKey],
        },
      ]}
    />
  );
};
