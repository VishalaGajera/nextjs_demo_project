import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter, useSearchParams } from "next/navigation";

export type PageTypes = "Add" | "Edit" | "View";

export type pageTitles = "Range Based" | "Custom Based";

export const TypeBasedSalaryStructureBreadCrumbs = ({
  ssId,
  pageType,
  pageTitle,
}: {
  ssId: string;
  pageType: PageTypes;
  pageTitle: pageTitles;
}) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const interval = searchParams.get("interval");

  const tab = searchParams.get("tab");

  const list = searchParams.get("list");

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
          text: "Salary Structure",
          onClick: () => router.push("/payroll/settings/salary-structure"),
        },
        {
          text: "Salary Structure Details",
          onClick: () =>
            router.push(
              `/payroll/settings/salary-structure/salary-structure-details/${ssId}?tab=${tab}interval=${interval}&list=${list}`
            ),
        },
        {
          text: `${pageType} ${pageTitle} Salary Structure Details`,
        },
      ]}
    />
  );
};
