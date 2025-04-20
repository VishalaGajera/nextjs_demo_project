import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const BulkDataImportsBreadcrumb = () => {
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
        },
      ]}
    />
  );
};
