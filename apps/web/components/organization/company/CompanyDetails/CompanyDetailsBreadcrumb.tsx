import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const CompanyDetailsBreadcrumb = () => {
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
          text: "Company",
          onClick: () => router.push("/organization/company"),
        },
        {
          text: "Company Details",
        },
      ]}
    />
  );
};
