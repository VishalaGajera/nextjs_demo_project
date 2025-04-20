import { useRouter } from "next/navigation";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  earning: "Earning",
  deduction: "Deduction",
  contribution: "Contribution",
  reimbursement: "Reimbursement",
};

export type OptionKey = keyof typeof categories;

export const useTabOptions = () => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: "earning",
      title: categories.earning,
      onClick: () =>
        router.push("/payroll/settings/salary-components?tab=earning"),
    },
    {
      value: "deduction",
      title: categories.deduction,
      onClick: () =>
        router.push("/payroll/settings/salary-components?tab=deduction"),
    },
    {
      value: "contribution",
      title: categories.contribution,
      onClick: () =>
        router.push("/payroll/settings/salary-components?tab=contribution"),
    },
    {
      value: "reimbursement",
      title: categories.reimbursement,
      onClick: () =>
        router.push("/payroll/settings/salary-components?tab=reimbursement"),
    },
  ];

  return { menuItems };
};
