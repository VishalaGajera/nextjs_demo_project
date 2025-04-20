import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const LeaveDetailsBreadCrumbs = () => {
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
          onClick: () =>
            router.push("/transactions/leave/leave-balance-summary"),
        },
        {
          text: "Leave Details",
        },
      ]}
    />
  );
};
