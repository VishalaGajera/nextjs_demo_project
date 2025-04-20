import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const AdvanceAndReceiveBreadCrumbs = () => {
  const router = useRouter();

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
          text: "Payroll Transaction",
        },
        {
          text: "Advance & Receive",
        },
      ]}
    />
  );
};
