import {
  SettingIcon,
  SvgBankConfig,
  SvgConfiguration,
  SvgPayroll,
  SvgsEmployees,
  SvgsHome,
  SvgsOrganization,
  SvgsTransaction,
  type DrawerProps,
} from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";
import type { HTMLAttributeAnchorTarget } from "react";
import type { DialogTypes } from "../../../types/dialogs";

export const drawerMenuItems = {
  home: "Home",
  organization: "Organization",
  "employee-management": "Employee Management",
  settings: "Settings",
  transactions: "Transactions",
  "policy-configuration": "Policy Configuration",
  payroll: "Payroll",
  bank_configurations: "Bank Configurations",
};

export type DrawerMenuItemsKeys = keyof typeof drawerMenuItems;

type UseDrawerMenuItemsArgs = {
  isOpenAddEditEmployeePage: boolean;
  onDialogOpen: (config: DialogTypes) => void;
  setCallBackUrl: (url: string) => void;
};

export const useDrawerMenuItems = ({
  isOpenAddEditEmployeePage,
  onDialogOpen,
  setCallBackUrl,
}: UseDrawerMenuItemsArgs) => {
  const router = useRouter();

  const onClick = (
    href: string,
    target: HTMLAttributeAnchorTarget = "_self"
  ) => {
    if (isOpenAddEditEmployeePage) {
      onDialogOpen("saveAsDraft");

      setCallBackUrl(href);
    } else if (target == "_self") {
      router.push(href);
    } else {
      window.open(href, target, "noopener,noreferrer");
    }
  };

  const menuItems: DrawerProps["menuItems"] = [
    {
      key: "home",
      title: "Home",
      icon: <SvgsHome />,
      onClick: (href, target) => onClick(href, target),
    },
    {
      key: "organization",
      title: "Organization",
      icon: <SvgsOrganization />,
      menuItems: [
        {
          key: "company",
          title: "Company",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "business-unit",
          title: "Business Unit",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "location",
          title: "Location",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "company-bank",
          title: "Company Bank",
          onClick: (href, target) => onClick(href, target),
        },
      ],
    },
    {
      key: "employee-management",
      title: "Employee Management",
      icon: <SvgsEmployees />,
      menuItems: [
        {
          key: "employee",
          title: "Employee",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "shifts",
          title: "Shifts",
          menuItems: [
            {
              key: "shift",
              title: "Shift",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
        {
          key: "weekly-offs",
          title: "Weekly Offs",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "holiday",
          title: "Holiday",
          onClick: (href, target) => onClick(href, target),
        },
      ],
    },
    {
      key: "policy-configuration",
      title: "Policy Configuration",
      icon: <SvgConfiguration />,
      menuItems: [
        {
          key: "attendance",
          title: "Attendance",
          menuItems: [
            {
              key: "penalty-rules",
              title: "Penalty Rules",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "penalty-rule-allocation",
              title: "Penalty Rule Allocation",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
        {
          key: "overtime",
          title: "Overtime",
          menuItems: [
            {
              key: "overtime-rules",
              title: "Overtime Rules",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "overtime-rate-type",
              title: "Overtime Rate",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "overtime-rule-allocation",
              title: "OT Rules Allocation",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
        {
          key: "leave",
          title: "Leave",
          menuItems: [
            {
              key: "leave-type",
              title: "Leave Type",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "leave-plan",
              title: "Leave Plan",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
        {
          key: "loan",
          title: "Loan",
          menuItems: [
            {
              key: "loan-policy",
              title: "Loan Policy",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
      ],
    },
    {
      key: "transactions",
      title: "Transactions",
      icon: <SvgsTransaction />,
      menuItems: [
        {
          key: "approvals",
          title: "Approvals",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "shift-day",
          title: "Shift & Day",
          menuItems: [
            {
              key: "shift-day-allocation",
              title: "Shift & Day Allocation",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "shift-planner",
              title: "Shift Planner",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
        {
          key: "attendance",
          title: "Attendance",
          menuItems: [
            {
              key: "attendance-overview",
              title: "Attendance Overview",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "bulk-attendance",
              title: "Bulk Attendance",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
        {
          key: "leave",
          title: "Leave",
          menuItems: [
            {
              key: "leave-overview",
              title: "Leave Overview",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "leave-balance-summary",
              title: "Leave Balance",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
      ],
    },
    {
      key: "payroll",
      title: "Payroll",
      icon: <SvgPayroll />,
      menuItems: [
        {
          key: "employee-finance",
          title: "Employee Finance",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "payroll-transaction",
          title: "Payroll Transaction",
          menuItems: [
            {
              key: "advance-receive",
              title: "Advance & Receive",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "loan",
              title: "Loan",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
        {
          key: "settings",
          title: "Settings",
          menuItems: [
            {
              key: "salary-components",
              title: "Salary Components",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "contributions",
              title: "Contributions",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "pay-schedule-setup",
              title: "Pay Schedule Setup",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "taxes-deductions",
              title: "Taxes & Deductions",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "salary-structure",
              title: "Salary Structure",
              onClick: (href, target) => onClick(href, target),
            },
          ],
        },
      ],
    },
    {
      key: "bank-configurations",
      title: "Bank Configurations",
      icon: <SvgBankConfig />,
      menuItems: [
        {
          key: "bank-shift",
          title: "Bank Shift",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "bank-shift-pattern",
          title: "Bank Shift Pattern",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "bank-shift-allocation",
          title: "Bank Shift Allocation",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "bank-holiday",
          title: "Bank Holiday",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "bank-pay-schedule",
          title: "Bank Pay Schedule",
          onClick: (href, target) => onClick(href, target),
        },
      ],
    },
    {
      key: "settings",
      title: "Settings",
      icon: <SettingIcon />,
      menuItems: [
        {
          key: "employee-code",
          title: "Employee Code",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "miscellaneous-data",
          title: "Miscellaneous Data",
          onClick: (href, target) => onClick(href, target),
        },
        {
          key: "bulk-data-management",
          title: "Bulk Data Management",
          onClick: (href, target) => onClick(href, target),
          menuItems: [
            {
              key: "data-upload",
              title: "Data Upload",
              onClick: (href, target) => onClick(href, target),
            },
            {
              key: "excel-template-configuration",
              title: "Excel Template Config",
              onClick: (href) => onClick(href),
            },
          ],
        },
      ],
    },
  ];

  return { menuItems };
};
