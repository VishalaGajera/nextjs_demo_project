import { Stack } from "@mui/material";
import { useState } from "react";
import { CustomBasedSalaryStructureList } from "./RangeBasedSalaryStructure/List/CustomBasedSalaryStructureList";
import { RangeBasedSalaryStructureList } from "./RangeBasedSalaryStructure/List/RangeBasedSalaryStructureList";
import type { SalaryStructureTypes } from "./Tabs/Tabs";
import { Tabs } from "./Tabs/Tabs";

export const SalaryStructureDetails = () => {
  const [salaryStructureType, setSalaryStructureType] =
    useState<SalaryStructureTypes>("range");

  const handleSalaryStructureType = (type: SalaryStructureTypes) => {
    setSalaryStructureType(type);
  };

  return (
    <Stack gap="15px">
      <Tabs handleSalaryStructureType={handleSalaryStructureType} />

      {salaryStructureType &&
        (salaryStructureType === "range" ? (
          <RangeBasedSalaryStructureList />
        ) : (
          <CustomBasedSalaryStructureList />
        ))}
    </Stack>
  );
};
