import { useRouter } from "next/navigation";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  "professional-tax": "Professional Tax",
  "income-tax-regime": "Income Tax Regime",
  "investment-deduction": "Investment Deductions",
};

export type OptionKey = keyof typeof categories;

export const useTabOptions = () => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: "professional-tax",
      title: categories["professional-tax"],
      onClick: () =>
        router.push("/payroll/settings/taxes-deductions?tab=professional-tax"),
    },
    {
      value: "income-tax-regime",
      title: categories["income-tax-regime"],
      onClick: () =>
        router.push("/payroll/settings/taxes-deductions?tab=income-tax-regime"),
    },
    {
      value: "investment-deduction",
      title: categories["investment-deduction"],
      onClick: () =>
        router.push(
          "/payroll/settings/taxes-deductions?tab=investment-deduction"
        ),
    },
  ];

  return { menuItems };
};
