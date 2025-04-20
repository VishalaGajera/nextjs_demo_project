import { useRouter } from "next/navigation";

export type SubTabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const subCategories = {
  "tax-sections": "Tax Sections",
  "investment-schemes": "Investment Schemes",
};

export type SubOptionKey = keyof typeof subCategories;

export const useSubTabOptions = () => {
  const router = useRouter();

  const menuItems: SubTabsItems[] = [
    {
      value: "tax-sections",
      title: subCategories["tax-sections"],
      onClick: () =>
        router.push(
          "/payroll/settings/taxes-deductions?tab=investment-deduction&subtab=tax-sections"
        ),
    },
    {
      value: "investment-schemes",
      title: subCategories["investment-schemes"],
      onClick: () =>
        router.push(
          "/payroll/settings/taxes-deductions?tab=investment-deduction&subtab=investment-schemes"
        ),
    },
  ];

  return { menuItems };
};
