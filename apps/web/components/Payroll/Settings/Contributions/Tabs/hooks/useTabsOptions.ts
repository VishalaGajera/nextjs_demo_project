import { useRouter } from "next/navigation";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  pf: "PF",
  esic: "ESIC",
  lwf: "LWF",
  gratuity: "Gratuity",
};

export type OptionKey = keyof typeof categories;

export const useTabOptions = () => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: "pf",
      title: "PF",
      onClick: () => router.push("/payroll/settings/contributions?tab=pf"),
    },
    {
      value: "esic",
      title: "ESIC",
      onClick: () => router.push("/payroll/settings/contributions?tab=esic"),
    },
    {
      value: "lwf",
      title: "LWF",
      onClick: () => router.push("/payroll/settings/contributions?tab=lwf"),
    },
    {
      value: "gratuity",
      title: "Gratuity",
      onClick: () =>
        router.push("/payroll/settings/contributions?tab=gratuity"),
    },
  ];

  return { menuItems };
};
