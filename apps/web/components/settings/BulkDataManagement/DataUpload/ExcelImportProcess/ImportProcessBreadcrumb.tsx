import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const ImportProcessBreadcrumb = () => {
  const router = useRouter();

  return (
    <Breadcrumbs
      items={[
        {
          icon: <SvgsHome />,
          onClick: () => router.push("/"),
        },
        {
          text: "Settings",
        },
        {
          text: "Bulk Data Management",
        },
        {
          text: "Data Upload",
          onClick: () =>
            router.push("/settings/bulk-data-management/data-upload"),
        },
        {
          text: "Import Process",
        },
      ]}
    />
  );
};
