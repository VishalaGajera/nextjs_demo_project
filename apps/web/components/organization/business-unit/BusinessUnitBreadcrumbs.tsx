import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const BusinessUnitBreadcrumbs = () => {
  const router = useRouter();

  return (
    <Breadcrumbs
      items={[
        {
          icon: <SvgsHome />,
          onClick: () => router.push("/"),
        },
        {
          text: "Organization",
        },
        {
          text: "Business Unit",
        },
      ]}
    />
  );
};
