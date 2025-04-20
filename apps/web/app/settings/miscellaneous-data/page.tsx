"use client";

import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Bank } from "../../../components/settings/miscellaneous-data/bank/Bank";
import { CategorySidebar } from "../../../components/settings/miscellaneous-data/CategorySidebar/CategorySidebar";
import {
  type CategoryKeys,
  categories,
} from "../../../components/settings/miscellaneous-data/CategorySidebar/hooks/useCategoryItems";
import { Department } from "../../../components/settings/miscellaneous-data/department/Department";
import { Designation } from "../../../components/settings/miscellaneous-data/designation/designation";
import { Grade } from "../../../components/settings/miscellaneous-data/grade/Grade";
import { Holiday } from "../../../components/settings/miscellaneous-data/holiday/Holiday";
import { Industry } from "../../../components/settings/miscellaneous-data/industry/Industry";
import { LoanCategory } from "../../../components/settings/miscellaneous-data/loan-category/LoanCategory";
import { SkillType } from "../../../components/settings/miscellaneous-data/skill-type/SkillType";
import { SubCaste } from "../../../components/settings/miscellaneous-data/sub-caste/SubCaste";
import { SubDepartment } from "../../../components/settings/miscellaneous-data/sub-department/SubDepartment";
import { WorkType } from "../../../components/settings/miscellaneous-data/work-type/WorkType";

export default function Page() {
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const router = useRouter();

  if (!tab) {
    return router.replace("/settings/miscellaneous-data?tab=industry");
  }

  if (!Object.keys(categories).includes(tab)) {
    return router.replace("/settings/miscellaneous-data?tab=industry");
  }

  const categoryRenderer: Record<CategoryKeys, ReactNode> = {
    industry: <Industry />,
    department: <Department />,
    "sub-department": <SubDepartment />,
    designation: <Designation />,
    "work-type": <WorkType />,
    bank: <Bank />,
    "skill-type": <SkillType />,
    grade: <Grade />,
    "sub-caste": <SubCaste />,
    holiday: <Holiday />,
    "loan-category": <LoanCategory />,
  };

  return (
    <Stack gap="10px">
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
            text: "Miscellaneous Data",
          },
          {
            text: categories[tab as CategoryKeys],
          },
        ]}
      />

      <Stack direction="row" gap="25px" sx={{ flex: 1 }}>
        <CategorySidebar />

        {tab && categoryRenderer[tab as CategoryKeys]}
      </Stack>
    </Stack>
  );
}
