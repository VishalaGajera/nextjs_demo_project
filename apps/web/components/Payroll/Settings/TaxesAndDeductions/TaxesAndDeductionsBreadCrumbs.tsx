import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter, useSearchParams } from "next/navigation";
import type { SubOptionKey } from "./InvestmentDeduction/SubTabs/hooks/useSubTabsOptions";
import { subCategories } from "./InvestmentDeduction/SubTabs/hooks/useSubTabsOptions";
import { categories, type OptionKey } from "./Tabs/hooks/useTabsOptions";

export const TaxesAndDeductionsBreadCrumbs = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const subTab = searchParams.get("subtab");

  const breadcrumbs = [
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
      text: "Taxes & Deductions",
    },
    {
      text: categories[tab as OptionKey],
    },
  ];

  if (subTab) {
    breadcrumbs.push({ text: subCategories[subTab as SubOptionKey] });
  }

  return <Breadcrumbs items={breadcrumbs} />;
};

export default TaxesAndDeductionsBreadCrumbs;
