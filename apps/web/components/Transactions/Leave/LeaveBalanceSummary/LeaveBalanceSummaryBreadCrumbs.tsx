import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const LeaveBalanceSummaryBreadCrumbs = () => {
  const router = useRouter();

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
          text: "Leave",
        },
        {
          text: "Leave Balance",
        },
      ]}
    />
  );
};
