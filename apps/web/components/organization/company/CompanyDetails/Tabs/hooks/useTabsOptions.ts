import { useRouter } from "next/navigation";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  "basic-details": "Basic Details",
  "statutory-details": "Statutory Details",
  "director-details": "Director Details",
  "authorised-person-details": "Authorised Person Details",
};

export type OptionKey = keyof typeof categories;

export type UseTabOptionsArgs = {
  companyId: string;
};

export const useTabOptions = ({ companyId }: UseTabOptionsArgs) => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: "basic-details",
      title: "Basic Details",
      onClick: () =>
        router.push(`/organization/company/${companyId}?tab=basic-details`),
    },
    {
      value: "statutory-details",
      title: "Statutory Details",
      onClick: () =>
        router.push(`/organization/company/${companyId}?tab=statutory-details`),
    },
    {
      value: "director-details",
      title: "Director Details",
      onClick: () =>
        router.push(`/organization/company/${companyId}?tab=director-details`),
    },
    {
      value: "authorised-person-details",
      title: "Authorised Person Details",
      onClick: () =>
        router.push(
          `/organization/company/${companyId}?tab=authorised-person-details`
        ),
    },
  ];

  return { menuItems };
};
